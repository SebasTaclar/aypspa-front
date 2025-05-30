import axios from 'axios';
import { getBaseUrl } from '@/utils/apiConfig';

export async function getPresignedUrl(fileName: string, fileType: string, action: string): Promise<string> {
  try {
    const token = sessionStorage.getItem('token');
    const url = `${getBaseUrl()}/api/v1/generatePreSignedUrlAwsS3`;

    const response = await axios.post(
      url,
      {
        fileName,
        fileType,
        action,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data.url;
  } catch (error) {
    console.error('Error  getting pre-signed URL:', error);
    throw error;
  }
}
