<button on:click|preventDefault={() => window.open("https://www.patreon.com/bePatron?u=15896855", "_blank")}>
	<svg viewBox="0 0 24 24">
		<path
			d="M14.82 2.398c-3.97 0-7.2 3.234-7.2 7.208 0 3.963 3.23 7.187 7.2 7.187 3.959 0 7.18-3.224 7.18-7.187 0-3.974-3.221-7.208-7.18-7.208zM2 21.598h3.516v-19.2H2v19.2z"
		/>
	</svg>
	Become a patron
</button>

<style scoped>
	button {
		align-items: center;
		background-color: hsl(357, 100%, 63%);
		border-radius: 1rem;
		display: flex;
		transition: all 300ms cubic-bezier(0.19, 1, 0.22, 1) 0s;
		color: white;
		gap: 0.5rem;
		width: fit-content;
		padding: 0 0.5rem;
		box-sizing: border-box;
		margin: 0.5ch;
		line-height: 1.5;
		border: none;
		flex: none;
	}
	button:active {
		background-color: hsl(356, 100%, 58%);
	}
	button:hover {
		background-color: hsl(356, 100%, 60%);
	}
	svg {
		display: block;
		width: 1em;
		height: rem;
	}
</style>
