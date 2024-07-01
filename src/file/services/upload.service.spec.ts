import {Test, TestingModule} from "@nestjs/testing"
import {UploadService} from "./upload.service"
import { File } from "../schemas/file.schema"
import { User } from "src/user/schemas/user.schema"

describe("UploadService", () => {
    let uploadService: UploadService

    const mockUploadService = {
        
    }

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UploadService
            ]
        }).compile()

        uploadService = module.get<UploadService>(UploadService)
    })
})