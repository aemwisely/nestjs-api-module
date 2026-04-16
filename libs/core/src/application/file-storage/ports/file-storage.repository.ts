export abstract class FileStorageFunctionalRepository {
  abstract putObjectAndPresignUrl(
    bucket: string,
    file: Express.Multer.File,
    main_folder: string,
    sub_folder: string,
  ): Promise<{
    filename: string;
    url: string;
    key: string;
  }>;

  abstract presignedUrl(bucket: string, key: string, expiry?: number): Promise<string>;
}
