import swc from 'rollup-plugin-swc'
import postcss from 'rollup-plugin-postcss'
import dts from 'rollup-plugin-dts'
export default [{
    input: 'src/index.tsx',
    output: {
        file: 'dist/es/index.js',
        format: 'es',
    },
    plugins: [
        postcss({
            modules: true,
            extensions: ['.less'],
            extract: 'bundle.css'
        }),
        swc({
            rollup: {
                exclude: 'node_modules'
            },
            jsc: {
                "loose": true,
                "target": "es2020",
                "transform": {
                    "react": {
                    "pragma": "React.createElement",
                    "pragmaFrag": "React.Fragment",
                    "runtime": "automatic",
                    "useBuiltIns": true
                    },
                    "legacyDecorator": true
                },
                parser: {
                    syntax: 'typescript',
                    tsx: true,
                    decorators: true
                },
            }
        })
    ],
    external: ['react', 'react-dom']
}, {
	input: 'src/index.tsx',
	output: {
		file: 'dist/index.d.ts',
		format: 'es'
	},
	plugins: [dts()]
}]
