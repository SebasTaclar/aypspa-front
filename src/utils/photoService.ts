import axios from 'axios'
import { getBaseUrl } from './apiConfig'

export interface PhotoUploadResult {
  success: boolean
  photoFileName?: string
  error?: string
}

export interface PhotoFetchResult {
  success: boolean
  imageUrl?: string
  error?: string
}

/**
 * Centralized photo service for handling client photo operations
 */
export class PhotoService {
  /**
   * Fetch a client's photo URL
   * @param clientId - The client's ID
   * @param photoFileName - Optional photo filename if known
   * @returns Promise with photo URL or error
   */
  static async fetchClientPhoto(
    clientId: string,
    photoFileName?: string,
  ): Promise<PhotoFetchResult> {
    try {
      const token = sessionStorage.getItem('token')

      if (!token) {
        return { success: false, error: 'No authentication token found' }
      }

      // If we have the photoFileName, use the direct API endpoint
      if (photoFileName && photoFileName.trim()) {
        const imageUrl = `${getBaseUrl()}/api/v1/clients/photo/${photoFileName}`
        return { success: true, imageUrl }
      }

      // If we don't have photoFileName, get client info first
      const clientResponse = await axios.get(`${getBaseUrl()}/api/v1/clients/${clientId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      if (clientResponse.data?.photoFileName && clientResponse.data.photoFileName.trim()) {
        const imageUrl = `${getBaseUrl()}/api/v1/clients/photo/${clientResponse.data.photoFileName}`
        return { success: true, imageUrl }
      }

      // No photo available
      return { success: true, imageUrl: undefined }
    } catch (error) {
      console.error('Error fetching client photo:', error)
      return {
        success: false,
        error: axios.isAxiosError(error) ? error.message : 'Unknown error occurred',
      }
    }
  }

  /**
   * Upload a client photo using the S3 presigned URL workflow
   * @param clientId - The client's ID
   * @param file - The image file to upload
   * @returns Promise with upload result
   */
  static async uploadClientPhoto(clientId: string, file: File): Promise<PhotoUploadResult> {
    try {
      const token = sessionStorage.getItem('token')

      if (!token) {
        return { success: false, error: 'No authentication token found' }
      }

      // Generate unique filename
      const timestamp = Date.now()
      const fileExtension = file.name.split('.').pop() || 'jpg'
      const fileName = `clients/${clientId}_${timestamp}.${fileExtension}`

      // Step 1: Get presigned URL for upload
      const presignedResponse = await axios.post(
        `${getBaseUrl()}/api/v1/files/presigned`,
        {
          fileName,
          fileType: file.type,
          action: 'save',
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        },
      )

      if (!presignedResponse.data?.url) {
        return { success: false, error: 'Failed to get presigned URL' }
      }

      // Step 2: Upload file to S3 using presigned URL
      const uploadResponse = await axios.put(presignedResponse.data.url, file, {
        headers: {
          'Content-Type': file.type,
        },
      })

      if (uploadResponse.status !== 200) {
        return { success: false, error: 'Failed to upload file to S3' }
      }

      // Step 3: Update client record with photo filename
      await axios.patch(
        `${getBaseUrl()}/api/v1/clients/${clientId}`,
        {
          photoFileName: fileName.split('/').pop(), // Just the filename without the 'clients/' prefix
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        },
      )

      return {
        success: true,
        photoFileName: fileName.split('/').pop(),
      }
    } catch (error) {
      console.error('Error uploading client photo:', error)
      return {
        success: false,
        error: axios.isAxiosError(error)
          ? error.response?.data?.message || error.message
          : 'Unknown error occurred',
      }
    }
  }

  /**
   * Delete a client photo
   * @param clientId - The client's ID
   * @returns Promise with deletion result
   */
  static async deleteClientPhoto(clientId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const token = sessionStorage.getItem('token')

      if (!token) {
        return { success: false, error: 'No authentication token found' }
      }

      // Clear the photoFileName from the client record
      await axios.patch(
        `${getBaseUrl()}/api/v1/clients/${clientId}`,
        {
          photoFileName: '',
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        },
      )

      return { success: true }
    } catch (error) {
      console.error('Error deleting client photo:', error)
      return {
        success: false,
        error: axios.isAxiosError(error)
          ? error.response?.data?.message || error.message
          : 'Unknown error occurred',
      }
    }
  }
}
