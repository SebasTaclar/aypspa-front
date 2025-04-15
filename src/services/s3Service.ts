export async function getPresignedUrl(filename: string, filetype: string): Promise<string> {
  const response = await fetch(`/api/s3-url?filename=${filename}&filetype=${filetype}`)
  if (!response.ok) throw new Error('Failed to get presigned URL')
  const data = await response.json()
  return data.url
}

export async function uploadFileToS3(presignedUrl: string, file: File): Promise<void> {
  const upload = await fetch(presignedUrl, {
    method: 'PUT',
    headers: {
      'Content-Type': file.type,
    },
    body: file,
  })
  if (!upload.ok) throw new Error('Failed to upload file to S3')
}
