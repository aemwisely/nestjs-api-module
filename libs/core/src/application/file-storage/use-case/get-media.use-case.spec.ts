import { CommonFilter } from '@libs/common/base';
import { GetMediaUseCase } from './get-media.use-case';

describe('GetMediaUseCase', () => {
  const repository = {
    getQueryPagination: jest.fn(),
  };
  const fileStorageService = {
    checkAndPresignedUrl: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns paginated media and refreshes URLs', async () => {
    const useCase = new GetMediaUseCase(repository as any, fileStorageService as any);
    const query = {
      andWhere: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      getManyAndCount: jest.fn(),
    };
    const mediaItems = [
      { id: 'media-1', url: 'old-1', bucket: 'private', key: 'key-1', is_public: false },
      { id: 'media-2', url: 'old-2', bucket: 'private', key: 'key-2', is_public: false },
    ];
    const qs = new CommonFilter();
    qs.page = 2;
    qs.limit = 2;

    repository.getQueryPagination.mockReturnValue(query);
    query.getManyAndCount.mockResolvedValue([mediaItems, 5]);
    fileStorageService.checkAndPresignedUrl
      .mockResolvedValueOnce('new-1')
      .mockResolvedValueOnce('new-2');

    const result = await useCase.findAllWithPagination(qs, {
      sub: 'user-1',
      email: 'jane@example.com',
    });

    expect(query.andWhere).toHaveBeenCalledWith('m.uploader_id = :uploader_id', {
      uploader_id: 'user-1',
    });
    expect(query.orderBy).toHaveBeenCalledWith('m.created_at', 'DESC');
    expect(fileStorageService.checkAndPresignedUrl).toHaveBeenCalledTimes(2);
    expect(result).toEqual({
      result: [
        expect.objectContaining({ id: 'media-1', url: 'new-1' }),
        expect.objectContaining({ id: 'media-2', url: 'new-2' }),
      ],
      total: 5,
      page: 2,
      limit: 2,
      pageCount: 3,
    });
  });

  it('skips the uploader filter when context is absent', async () => {
    const useCase = new GetMediaUseCase(repository as any, fileStorageService as any);
    const query = {
      andWhere: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      getManyAndCount: jest.fn().mockResolvedValue([[], 0]),
    };

    repository.getQueryPagination.mockReturnValue(query);

    await useCase.findAllWithPagination(new CommonFilter(), null as any);

    expect(query.andWhere).not.toHaveBeenCalled();
  });
});
