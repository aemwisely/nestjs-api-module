import { BuildReportUseCase } from './build-report.use-case';

describe('BuildReportUseCase', () => {
  it('forwards the report request to the XLSX provider', async () => {
    const xlsxProvider = {
      buildFile: jest.fn().mockResolvedValue(undefined),
    };
    const useCase = new BuildReportUseCase(xlsxProvider as any);
    const response = {} as any;

    await useCase.buildXLSX(
      {
        option: {
          topic: 'Users',
          filename: 'users-report',
          sheet_name: 'Public',
          authorized_by: 'Jane Doe',
          headers: ['#', 'Name'],
        },
        data: [['1', 'Jane Doe']],
      },
      response,
    );

    expect(xlsxProvider.buildFile).toHaveBeenCalledWith(
      'Users',
      'users-report',
      'Public',
      'Jane Doe',
      ['#', 'Name'],
      [['1', 'Jane Doe']],
      response,
    );
  });
});
