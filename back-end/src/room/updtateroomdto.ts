import { CreateRoomDto } from "./createroomdto";
import { PartialType } from "@nestjs/mapped-types";

export class UpdateRoomDto extends PartialType(CreateRoomDto){}

