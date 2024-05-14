import { Prisma } from '@prisma/client'

import { prisma } from '@/lib/prisma'

import { CheckInRepository } from '../check-ins-repository'

export class PrismaCheckInRepository implements CheckInRepository {
  async create({ user_id, gym_id }: Prisma.CheckInUncheckedCreateInput) {
    const checkIn = await prisma.checkIn.create({
      data: {
        user_id,
        gym_id,
      },
    })

    return checkIn
  }
}
