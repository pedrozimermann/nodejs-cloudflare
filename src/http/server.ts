import {fastify} from "fastify";
import {GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3'
import {getSignedUrl} from '@aws-sdk/s3-request-presigner'
import { randomUUID } from "node:crypto"
import { z } from 'zod'
import { PrismaClient } from '@prisma/client'
import { r2 } from '../lib/cloudflare'

const app = fastify();

const prisma = new PrismaClient() 

app.post('/uploads',  async (request)=>{
    const uploadBodySchema = z.object({
        name: z.string().min(1),
        contentType: z.string().regex(/\w+\/[-+.\w]+/),
    })

    const {name, contentType} = uploadBodySchema.parse(request.body)

    const fileKey = randomUUID().concat('-').concat(name)

    const signedUrl = await getSignedUrl(
        r2,
        new PutObjectCommand({
            Bucket: 'nebulaport-dev',
            Key: fileKey,
            ContentType: contentType,
        }),
        { expiresIn: 600 },
    )

    const file = await prisma.file.create({
        data: {
            name,
            contentType,
            key: fileKey,
        }
    })

    return {signedUrl, fileId: file.id}
})

app.get('/uploads/:id', async (request) => {
    const getFilesParamsSchema = z.object({
        id: z.string().cuid(),
    })

    const { id } = getFilesParamsSchema.parse(request.params)

    const file = await prisma.file.findUniqueOrThrow({
        where: {
            id,
        }
    })

    const signedUrl = await getSignedUrl(
        r2,
        new GetObjectCommand({
            Bucket: 'nebulaport-dev',
            Key: file.key,
        }),
        { expiresIn: 600 },
    )

    return { signedUrl}

})


app.listen({
    port: 3333,
    host: '0.0.0.0',
}).then(() => {
    console.log(' 🙌 HTTP Server is Running!');
})