<script>
	export let size = 200;
	export let percentage = 0;
	export let bgColor = "cornflowerblue";
	export let fgColor = "orange";

	$: viewBox = `0 0 ${size} ${size}`;

	$: radius = size / 2;
	$: halfCircumference = Math.PI * radius;
	$: pieSize = halfCircumference * (percentage / 100);
	$: dashArray = `0 ${halfCircumference - pieSize} ${pieSize}`;

	/* document.addEventListener("mousemove", callback);

	function callback(e) {
		const old = game.tooltip._setAnchor;
		if (e.target.closest("svg")?.closest(".mcc")) {
			game.tooltip._setAnchor = () => {};
			game.tooltip._setStyle({ left: e.x, top: e.y });
		}
		game.tooltip._setAnchor = old;
	} */
</script>

<div data-tooltip={`${percentage}%`} title={`${percentage}%`}>
	<svg width={size} height={size} {viewBox}>
		<circle r={radius} cx={radius} cy={radius} fill={bgColor} />
		<circle
			r={radius / 2}
			cx={radius}
			cy={radius}
			fill={bgColor}
			stroke={fgColor}
			stroke-width={radius}
			stroke-dasharray={dashArray}
		/>
	</svg>
</div>
