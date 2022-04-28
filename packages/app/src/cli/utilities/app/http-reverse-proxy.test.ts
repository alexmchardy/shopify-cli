import {runConcurrentHTTPProcessesAndPathForwardTraffic} from './http-reverse-proxy'
import {describe, expect, test, vi} from 'vitest'
import Fastify from 'fastify'
import {port, output} from '@shopify/cli-kit'
import fastifyHttpProxy from 'fastify-http-proxy'

vi.mock('fastify')
vi.mock('@shopify/cli-kit')
vi.mock('fastify-http-proxy')

describe('runConcurrentHTTPProcessesAndPathForwardTraffic', () => {
  test('proxies to all the targets using the Fastify HTTP Proxy', async () => {
    // Given
    const server: any = {register: vi.fn(), listen: vi.fn(), close: vi.fn()}
    vi.mocked(Fastify).mockReturnValue(server)
    vi.mocked(port.getRandomPort).mockResolvedValueOnce(3001)
    vi.mocked(port.getRandomPort).mockResolvedValueOnce(3002)

    // When
    const got = await runConcurrentHTTPProcessesAndPathForwardTraffic(3000, [
      {
        logPrefix: 'extensions',
        pathPrefix: '/extensions',
        action: async (stdout, stderr, signal, port) => {},
      },
      {
        logPrefix: 'home',
        action: async (stdout, stderr, signal, port) => {},
      },
    ])

    // Then
    expect(server.register).toHaveBeenCalledWith(fastifyHttpProxy, {
      upstream: `http://localhost:3001`,
      prefix: '/extensions',
      rewritePrefix: '/extensions',
      http2: false,
    })
    expect(server.register).toHaveBeenCalledWith(fastifyHttpProxy, {
      upstream: `http://localhost:3002`,
      prefix: undefined,
      rewritePrefix: undefined,
      http2: false,
    })
    const concurrentCalls = (output.concurrent as any).calls
    expect(concurrentCalls.length).toEqual(1)
    const concurrentProcesses = concurrentCalls[0][0]
    expect(concurrentProcesses[0].prefix).toEqual('extensions')
    expect(concurrentProcesses[1].prefix).toEqual('home')
    expect(got.port).toEqual(3000)
    expect(server.close).not.toHaveBeenCalled()
    await got.close()
    expect(server.close).toHaveBeenCalled()
  })

  test('uses a random port when no port is passed', async () => {
    // Given
    const server: any = {register: vi.fn(), listen: vi.fn(), close: vi.fn()}
    vi.mocked(Fastify).mockReturnValue(server)
    vi.mocked(port.getRandomPort).mockResolvedValueOnce(4000)

    // When
    const got = await runConcurrentHTTPProcessesAndPathForwardTraffic(undefined, [])

    // Then
    expect(got.port).toEqual(4000)
    expect(server.close).not.toHaveBeenCalled()
    await got.close()
    expect(server.close).toHaveBeenCalled()
  })
})