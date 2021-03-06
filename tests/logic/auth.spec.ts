import * as inquirer from 'inquirer'
import {getUser} from '../../logic/auth'
import {userPath} from '../../constants/paths'
import {clearUserCache, readJSONSync, writeJSONSync} from '../../lib/tool'

jest.mock('inquirer')

beforeAll(() => {
  clearUserCache()
})
afterAll(() => {
  clearUserCache()
})

describe('getUser', () => {
  it('获取缓存的用户', async () => {
    process.env.NODE_ENV = 'production'

    // 加入缓存的用户
    const mockUser = {username: 'CacheJack', password: '123'}
    writeJSONSync(userPath, mockUser)

    const user = await getUser()

    expect(user.username).toEqual(mockUser.username)
    expect(user.password).toEqual(mockUser.password)

    // 还原缓存
    clearUserCache()
  })
  it('获取命令行输入的用户', async () => {
    // 置空用户
    clearUserCache()

    process.env.NODE_ENV = 'production'

    const mockUser = {username: 'NotSavedJack', password: '123', saveCache: false}

    // @ts-ignore
    inquirer.prompt.mockResolvedValue(mockUser)

    const user = await getUser()

    expect(user.username).toEqual(mockUser.username)
    expect(user.password).toEqual(mockUser.password)
  })
  it('可以缓存用户', async () => {
    // 置空用户
    clearUserCache()

    process.env.NODE_ENV = 'production'

    const mockUser = {username: 'SavedJack', password: '123', saveCache: true}

    // @ts-ignore
    inquirer.prompt.mockResolvedValue(mockUser)

    const user = await getUser()

    expect(user.username).toEqual(mockUser.username)
    expect(user.password).toEqual(mockUser.password)

    const cacheUser = readJSONSync(userPath)

    expect(cacheUser.username).toEqual(mockUser.username)
    expect(cacheUser.password).toEqual(mockUser.password)

    // 还原缓存
    clearUserCache()
  })
})
