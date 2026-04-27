import { ReportsController } from './reports.controller';

describe('ReportsController', () => {
  it('delegates report generation to the service', async () => {
    const reportService = {
      getBuildXLSXOfUser: jest.fn().mockResolvedValue(undefined),
    };
    const controller = new ReportsController(reportService as any);
    const response = {} as any;
    const context = { sub: 'user-1', email: 'jane@example.com' };

    await controller.getReportUser(response, context);

    expect(reportService.getBuildXLSXOfUser).toHaveBeenCalledWith(response, context);
  });
});
