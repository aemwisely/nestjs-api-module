import { CommonFilter } from '@libs/common/base';
import { MediaObjectController } from './media-object.controller';

describe('MediaObjectController', () => {
  const createMediaUseCase = {
    execute: jest.fn(),
  };
  const getMediaUseCase = {
    findAllWithPagination: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('wraps create results in a result object', async () => {
    const controller = new MediaObjectController(createMediaUseCase as any, getMediaUseCase as any);
    const files = [{ originalname: 'photo.png' }] as Express.Multer.File[];
    const body = { bucket: 'public' };
    const context = { sub: 'user-1', email: 'jane@example.com' };
    createMediaUseCase.execute.mockResolvedValue([{ id: 'media-1' }]);

    const result = await controller.created(files, body as any, context);

    expect(createMediaUseCase.execute).toHaveBeenCalledWith('public', files, context);
    expect(result).toEqual({ result: [{ id: 'media-1' }] });
  });

  it('delegates pagination queries to the use case', async () => {
    const controller = new MediaObjectController(createMediaUseCase as any, getMediaUseCase as any);
    const qs = new CommonFilter();
    const context = { sub: 'user-1', email: 'jane@example.com' };
    getMediaUseCase.findAllWithPagination.mockResolvedValue({ result: [], total: 0 });

    const result = await controller.findAllWithPagination(qs, context);

    expect(getMediaUseCase.findAllWithPagination).toHaveBeenCalledWith(qs, context);
    expect(result).toEqual({ result: [], total: 0 });
  });
});
