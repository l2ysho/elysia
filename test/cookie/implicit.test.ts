import { describe, expect, it } from 'bun:test'
import { createCookieJar } from '../../src/cookie'
import type { Context } from '../../src'

const create = () => {
	const set: Context['set'] = {
		cookie: {},
		headers: {}
	}

	const cookie = createCookieJar({}, set)

	return {
		cookie,
		set
	}
}

describe('Implicit Cookie', () => {
	it('create cookie using setter', () => {
		const {
			cookie: { name },
			set
		} = create()

		name.value = 'himari'

		expect(set.cookie?.name).toEqual({
			value: 'himari'
		})
	})

	it('create cookie set function', () => {
		const {
			cookie: { name },
			set
		} = create()

		name.set({
			value: 'himari'
		})

		expect(set.cookie?.name).toEqual({
			value: 'himari'
		})
	})

	it('add cookie attribute using setter', () => {
		const {
			cookie: { name },
			set
		} = create()

		name.value = 'himari'
		name.domain = 'millennium.sh'

		expect(set.cookie?.name).toEqual({
			value: 'himari',
			domain: 'millennium.sh'
		})
	})

	it('add cookie attribute using setter', () => {
		const {
			cookie: { name },
			set
		} = create()

		name.value = 'himari'
		name.add({
			domain: 'millennium.sh'
		})

		expect(set.cookie?.name).toEqual({
			value: 'himari',
			domain: 'millennium.sh'
		})
	})

	it('add cookie attribute without overwrite entire property', () => {
		const {
			cookie: { name },
			set
		} = create()

		name.set({
			value: 'himari',
			domain: 'millennium.sh'
		}).add({
			httpOnly: true,
			path: '/'
		})

		expect(set.cookie?.name).toEqual({
			value: 'himari',
			domain: 'millennium.sh',
			httpOnly: true,
			path: '/'
		})
	})

	it('set cookie attribute', () => {
		const {
			cookie: { name },
			set
		} = create()

		name.set({
			value: 'himari',
			domain: 'millennium.sh'
		}).set({
			httpOnly: true,
			path: '/'
		})

		expect(set.cookie?.name).toEqual({
			value: 'himari',
			httpOnly: true,
			path: '/'
		})
	})

	it('add cookie overwrite attribute if duplicated', () => {
		const {
			cookie: { name },
			set
		} = create()

		name.set({
			value: 'aru',
			domain: 'millennium.sh',
			httpOnly: true
		}).add({
			domain: 'gehenna.sh'
		})

		expect(set.cookie?.name).toEqual({
			value: 'aru',
			domain: 'gehenna.sh',
			httpOnly: true
		})
	})

	it('create cookie with empty string', () => {
		const {
			cookie: { name },
			set
		} = create()

		name.value = ''

		expect(set.cookie?.name).toEqual({ value: '' })
	})

	it('Remove cookie', () => {
		const {
			cookie: { name },
			set
		} = create()

		name.value = 'himari'
		name.remove()

		expect(set.cookie?.name.expires?.getTime()).toBeLessThanOrEqual(
			Date.now()
		)
	})
})
