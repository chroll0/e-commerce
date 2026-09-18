import { ArrayUnique, IsArray, IsInt } from "class-validator";

export class AssignLabelsDto {
  @IsArray()
  @ArrayUnique()
  @IsInt({ each: true })
  labelIds: number[];
}
