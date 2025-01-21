export function generateS3Url(objectKey: string) {
    return `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${objectKey}`;
  }

  export function generateClientS3Url(objectKey: string) {
    const url=`https://${process.env.NEXT_PUBLIC_S3_BUCKET_NAME}.s3.${process.env.NEXT_PUBLIC_AWS_REGION}.amazonaws.com/${objectKey}`
    console.log("url",url)
    return url;
  }


  export function generateCdnS3Url(objectKey: string) {
    // console.log("NEXT_PUBLIC_AWS_CDN",NEXT_PUBLIC_AWS_CDN)
    console.log("URL PLAYBACK",`${process.env.NEXT_PUBLIC_AWS_CDN}/${objectKey}`)
    return `${process.env.NEXT_PUBLIC_AWS_CDN}/${objectKey}`;
  }


  
  