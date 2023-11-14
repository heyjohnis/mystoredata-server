import { config } from "../config.js";
import soap from "soap";

export class BaroService {
  constructor(serviceName, opsKind) {
    this.serviceName = serviceName;
    this.opsKind = opsKind || "TEST";
  }
  async client() {
    const testClient = await soap.createClientAsync(
      `${config.baro.testUrl}/${this.serviceName}.asmx?WSDL`
    );
    const opsClient = await soap.createClientAsync(
      `${config.baro.opsUrl}/${this.serviceName}.asmx?WSDL`
    );
    return this.opsKind === "OPS" ? opsClient : testClient;
  }

  get certKey() {
    return config.baro[this.opsKind === "OPS" ? "opsCertKey" : "testCertKey"];
  }
}
