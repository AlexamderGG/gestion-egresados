"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateEgresadoDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
class HabilidadDto {
}
__decorate([
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], HabilidadDto.prototype, "habilidadId", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(5),
    __metadata("design:type", Number)
], HabilidadDto.prototype, "nivel", void 0);
class CreateEgresadoDto {
}
exports.CreateEgresadoDto = CreateEgresadoDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateEgresadoDto.prototype, "nombres", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateEgresadoDto.prototype, "apellidos", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateEgresadoDto.prototype, "telefono", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateEgresadoDto.prototype, "carrera", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], CreateEgresadoDto.prototype, "anio_egreso", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateEgresadoDto.prototype, "cv_url", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateEgresadoDto.prototype, "habilidades_blandas", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Date)
], CreateEgresadoDto.prototype, "fecha_nacimiento", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => HabilidadDto),
    __metadata("design:type", Array)
], CreateEgresadoDto.prototype, "habilidades", void 0);
//# sourceMappingURL=create-egresado.dto.js.map