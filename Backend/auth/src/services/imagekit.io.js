const ImageKit= require('imagekit')

const imagekit = new ImageKit({
    publicKey :  process.env.PUBLIC_KEY,
    privateKey : process.env.PRIVATE_KEY,
    urlEndpoint : process.env.urlEndpoint
});

async function imageUpload (File,fileName){
    const response = await imagekit.upload({
        file:File,
        fileName:fileName,
        folder:'Spotify',
    })

    return response.url
}

module.exports=imageUpload