import swc from 'rollup-plugin-swc'
import dts from 'rollup-plugin-dts'
import extensions from 'rollup-plugin-extensions'

export default [{
    input: 'src/index.ts',
    output: {
        file: 'dist/es/index.js',
        format: 'es',
    },
    plugins: [
        extensions({
            extensions: ['.ts'],
            resolveIndex: true,
        }),
        swc({
            rollup: {
                exclude: 'node_modules'
            },
            jsc: {
                "loose": true,
                "target": "es2020",
                "transform": {
                    "legacyDecorator": true
                },
                parser: {
                    syntax: 'typescript',
                    decorators: true
                },
            }
        })
    ],
    external: ['react', 'react-dom']
}, {
	input: 'src/index.ts',
	output: {
		file: 'dist/index.d.ts',
		format: 'es'
	},
	plugins: [dts()]
}]
