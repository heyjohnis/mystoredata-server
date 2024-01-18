import TransModel from "../model/transModel.js";
import AnnualModel from "../model/annualRule.js";

export async function getCategorySum(req) {
  try {
    const { userId, year } = req.body;
    return await TransModel.aggregate([
      {
        $match: {
          userId,
          transDate: {
            $gte: new Date(year, 0, 1),
            $lte: new Date(year, 11, 31),
          },
        },
      },
      {
        $group: {
          _id: {
            category: "$category",
            useKind: "$useKind",
            finClassCode: "$finClassCode",
          },
          year: { $first: year },
          category: { $first: "$category" },
          categoryName: { $first: "$categoryName" },
          total: { $sum: "$transMoney" },
          userId: { $last: "$userId" },
          user: { $last: "$user" },
          useKind: { $last: "$useKind" },
          finClassCode: { $last: "$finClassCode" },
        },
      },
    ]);
  } catch (error) {
    console.log({ error });
    return { error };
  }
}

export async function getAnnualYearData(req) {
  try {
    const { userId, year } = req.body;
    console.log({ userId, year });
    return await AnnualModel.findOne({ userId, year });
  } catch (error) {
    console.log({ error });
    return { error };
  }
}

export async function saveAnnualSum(req) {
  const { userId, year } = req.body;
  const data = await getCategorySum(req);
  const finClass = setFinClassData(data);
  const finClassAmount = setFinClassAmount(finClass);
  return await AnnualModel.updateOne(
    { userId, year },
    {
      category: data,
      finClass,
      finClassAmount,
    },
    { upsert: true }
  );
}

function setFinClassData(data) {
  const IN1 = data.filter((item) => item.finClassCode === "IN1");
  const IN2 = data.filter((item) => item.finClassCode === "IN2");
  const IN3 = data.filter((item) => item.finClassCode === "IN3");
  const OUT1 = data.filter((item) => item.finClassCode === "OUT1");
  const OUT1_PERSONAL = sumPersonalLog(OUT1);
  const OUT2 = data.filter((item) => item.finClassCode === "OUT2");
  const OUT3 = data.filter((item) => item.finClassCode === "OUT3");
  const IN_OUT2 = setInOutKeyArray(
    [...IN2, ...setNagativeNumber(OUT2)],
    "IN_OUT2"
  );
  const IN_OUT3 = setInOutKeyArray(
    [...IN3, ...setNagativeNumber(OUT3)],
    "IN_OUT3"
  );
  return {
    IN1,
    IN2,
    IN3,
    OUT1,
    OUT1_PERSONAL,
    OUT2,
    OUT3,
    IN_OUT2,
    IN_OUT3,
  };
}

function setFinClassAmount(data) {
  const amount = {};
  Object.keys(data).forEach((key) => {
    if (Array.isArray(data[key])) {
      amount[key] = data[key].reduce((sum, cur) => {
        return sum + cur.total;
      }, 0);
    }
  });
  return amount;
}

function setNagativeNumber(arr) {
  return arr.map((c) => {
    c.total = c.total * -1;
    return c;
  });
}

const setInOutKeyArray = (arr, finClassCode) => {
  if (!arr.length) return [];
  const { user, userId, year, userKind } = arr[0];
  return arr.reduce((acc, cur) => {
    const hasEl = acc.find((c) => {
      return c.category === cur.category;
    });
    if (hasEl) {
      hasEl.total += cur.total;
    } else {
      acc.push({
        finClassCode,
        category: cur.category,
        categoryName: cur.categoryName,
        total: cur.total,
        userKind,
        user,
        userId,
        year,
      });
    }
    return acc;
  }, []);
};

function sumPersonalLog(OUT1Arr) {
  if (!OUT1Arr.length) return [];
  console.log({ OUT1Arr });
  const { user, userId, year, userKind } = OUT1Arr[0];
  const personalLogs = OUT1Arr.filter((item) => item?.useKind === "PERSONAL");
  const sumPersonal = personalLogs.reduce((sum, cur) => {
    return sum + cur.total;
  }, 0);
  const bizArr = OUT1Arr.filter((log) => log?.useKind === "BIZ");
  return [
    ...bizArr,
    {
      category: "-99999999",
      categoryName: "가계비",
      finClassCode: "OUT1",
      total: sumPersonal,
      userKind,
      user,
      userId,
      year,
    },
  ];
}
