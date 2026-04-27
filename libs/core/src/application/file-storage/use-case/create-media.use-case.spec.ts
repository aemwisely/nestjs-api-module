import { CreateMediaUseCase } from './create-media.use-case';

describe('CreateMediaUseCase', () => {
  it('delegates media creation to the repository', async () => {
    const repository = {
      createMedia: jest.fn().mockResolvedValue([{ id: 'media-1' }]),
    };
    const useCase = new CreateMediaUseCase(repository as any);
    const files = [{ originalname: 'photo.png' }] as Express.Multer.File[];
    const context = { sub: 'user-1', email: 'jane@example.com' };

    const result = await useCase.execute('public', files, context);

    expect(repository.createMedia).toHaveBeenCalledWith('public', files, context);
    expect(result).toEqual([{ id: 'media-1' }]);
  });
});
