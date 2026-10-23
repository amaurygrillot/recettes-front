import { describe, expect, it, vi } from 'vitest'
import { createLogger, type LogLevel, type LogSink, type LogThreshold } from './logger'

function fakeSink(): LogSink {
  return { debug: vi.fn(), info: vi.fn(), warn: vi.fn(), error: vi.fn() }
}

const LEVELS: readonly LogLevel[] = ['debug', 'info', 'warn', 'error']

const WRITTEN_AT: readonly (readonly [threshold: LogThreshold, written: readonly LogLevel[]])[] = [
  ['debug', ['debug', 'info', 'warn', 'error']],
  ['info', ['info', 'warn', 'error']],
  ['warn', ['warn', 'error']],
  ['error', ['error']],
  ['silent', []],
]

describe('createLogger', () => {
  it.each(WRITTEN_AT)('with the threshold %s writes %j', (threshold, written) => {
    const sink = fakeSink()
    const logger = createLogger(sink, threshold)

    for (const level of LEVELS) logger[level]('event')

    const reached = LEVELS.filter((level) => vi.mocked(sink[level]).mock.calls.length > 0)
    expect(reached).toEqual(written)
  })

  it('forwards the message and its context to the matching level', () => {
    const sink = fakeSink()

    createLogger(sink, 'debug').warn('Call failed', { status: 503 })

    expect(sink.warn).toHaveBeenCalledWith('Call failed', { status: 503 })
  })

  it('does not pass an empty context along', () => {
    const sink = fakeSink()

    createLogger(sink, 'debug').info('Signed in')

    expect(sink.info).toHaveBeenCalledWith('Signed in')
  })
})
