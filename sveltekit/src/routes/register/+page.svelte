<script>
	import { enhance } from '$app/forms';
</script>

<form action="?/register" method="post" use:enhance>
	<input type="text" name="username" placeholder="Username" required />
	<input type="password" name="password" placeholder="Password" required />
	<input type="password" name="password2" placeholder="Repeat Password" required />
	<button type="submit">Register</button>
</form>
