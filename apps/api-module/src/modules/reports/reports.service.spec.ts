import { ReportsService } from './reports.service';

describe('ReportsService', () => {
  it('builds the user XLSX payload and delegates report generation', async () => {
    const buildReportUseCase = {
      buildXLSX: jest.fn().mockResolvedValue(undefined),
    };
    const getUserUseCase = {
      getOneEntity: jest.fn().mockResolvedValue({
        first_name: 'Jane',
        last_name: 'Doe',
      }),
      getAllEntity: jest.fn().mockResolvedValue([
        {
          first_name: 'Jane',
          last_name: 'Doe',
          email: 'jane@example.com',
          is_active: true,
        },
        {
          first_name: 'John',
          last_name: 'Smith',
          email: 'john@example.com',
          is_active: false,
        },
      ]),
    };
    const service = new ReportsService(buildReportUseCase as any, getUserUseCase as any);
    const response = {} as any;

    await service.getBuildXLSXOfUser(response, { sub: 'user-1', email: 'jane@example.com' });

    expect(getUserUseCase.getOneEntity).toHaveBeenCalledWith('user-1');
    expect(getUserUseCase.getAllEntity).toHaveBeenCalled();
    expect(buildReportUseCase.buildXLSX).toHaveBeenCalledWith(
      expect.objectContaining({
        option: expect.objectContaining({
          filename: expect.any(String),
          sheet_name: 'Public',
          topic: 'จัดการผู้ใช้งาน',
          authorized_by: 'Jane Doe',
        }),
        data: [
          ['1', 'Jane Doe', 'jane@example.com', 'อยู่ระหว่างการใช้งาน'],
          ['2', 'John Smith', 'john@example.com', 'ปิดการใช้งาน'],
        ],
      }),
      response,
    );
  });
});
