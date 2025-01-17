import {Banner} from './Banner.js'
import {renderString} from '../../ui.js'
import {describe, expect, test} from 'vitest'
import React from 'react'

describe('Banner', async () => {
  test('renders with a border for success', async () => {
    const {output} = renderString(<Banner type="success" />)

    expect(output).toMatchInlineSnapshot(`
      "[32m╭─[39m success [32m────────────────────────────────────────────────────────────────────╮[39m
      [32m│[39m                                                                              [32m│[39m
      [32m│[39m                                                                              [32m│[39m
      [32m╰──────────────────────────────────────────────────────────────────────────────╯[39m"
    `)
  })

  test('renders with a border for info', async () => {
    const {output} = renderString(<Banner type="info" />)
    expect(output).toMatchInlineSnapshot(`
      "[2m╭─[22m info [2m───────────────────────────────────────────────────────────────────────╮[22m
      [2m│[22m                                                                              [2m│[22m
      [2m│[22m                                                                              [2m│[22m
      [2m╰──────────────────────────────────────────────────────────────────────────────╯[22m"
    `)
  })

  test('renders with a border for warning', async () => {
    const {output} = renderString(<Banner type="warning" />)
    expect(output).toMatchInlineSnapshot(`
      "[33m╭─[39m warning [33m────────────────────────────────────────────────────────────────────╮[39m
      [33m│[39m                                                                              [33m│[39m
      [33m│[39m                                                                              [33m│[39m
      [33m╰──────────────────────────────────────────────────────────────────────────────╯[39m"
    `)
  })

  test('renders with a border for error', async () => {
    const {output} = renderString(<Banner type="error" />)
    expect(output).toMatchInlineSnapshot(`
      "[31m╭─[39m error [31m──────────────────────────────────────────────────────────────────────╮[39m
      [31m│[39m                                                                              [31m│[39m
      [31m│[39m                                                                              [31m│[39m
      [31m╰──────────────────────────────────────────────────────────────────────────────╯[39m"
    `)
  })

  test('renders with a top and bottom lines only for external errors', async () => {
    const {output} = renderString(<Banner type="external_error" />)

    expect(output).toMatchInlineSnapshot(`
      "[31m──[39m external error [31m──────────────────────────────────────────────────────────────[39m


      [31m────────────────────────────────────────────────────────────────────────────────[39m"
    `)
  })
})
