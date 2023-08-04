import { prisma } from '@/lib/prisma'
import { hash } from 'bcryptjs'

interface RegisterUseCaseRequest {
  name: string
  password: string
  email: string
}

export class RegisterUseCase {
  // eslint-disable-next-line prettier/prettier
  constructor(private userRepository: any) { }

  async execute({ name, email, password }: RegisterUseCaseRequest) {
    const password_hash = await hash(password, 6)

    const userWithSameEmail = await prisma.user.findUnique({
      where: {
        email,
      },
    })

    if (userWithSameEmail) {
      throw new Error('Email already exists.')
    }

    await this.userRepository.create({
      name,
      email,
      password_hash,
    })
  }
}
