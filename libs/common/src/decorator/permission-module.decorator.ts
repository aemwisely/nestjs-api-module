import { SetMetadata } from '@nestjs/common';
import { EModule } from '../exception';

export const PERMISSION_MODULE_CODE = 'permission_module_code';

export const PermissionModuleCode = (moduleCode: EModule) =>
  SetMetadata(PERMISSION_MODULE_CODE, moduleCode);
