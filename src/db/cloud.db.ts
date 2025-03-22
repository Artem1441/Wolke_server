import queryDB from ".";

export const uploadFileQuery = async (
  userId: any,
  fileName: string,
  normalizedFileType: string,
  fileSize: any,
  url: string,
  is_active: string
) => {
  const query = `
    INSERT INTO files (user_id, file_name, file_type, file_size, file_url, is_active)
    VALUES ($1, $2, $3, $4, $5, $6) RETURNING id;`;

  const result = await queryDB(query, [
    userId,
    fileName,
    normalizedFileType,
    fileSize,
    url,
    is_active
  ]);

  return result.rows[0].id;
};
