<script>
	import '../app.postcss';
	import { page } from '$app/stores';
</script>

<style>
	[aria-current]:not([aria-current="false"]) {
		font-weight: bold;
	}
</style>

<nav>
	<a href="/" aria-current={$page.url.pathname === '/'}>
		home
	</a>

	<a href="/about" aria-current={$page.url.pathname === '/about'}>
		about
	</a>
</nav>

<main class="w-full h-screen mx-auto relative px-2">
	<slot />
</main>
