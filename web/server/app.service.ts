import { Get, Injectable } from "@nestjs/common";

@Injectable()
export class AppService {
  @Get()
  getHello() {
    return "Hello Sokiraon!";
  }
}