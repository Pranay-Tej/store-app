<script>
	import { enhance } from '$app/forms';
</script>

<form action="?/login" method="post" use:enhance>
	<input type="text" name="username" placeholder="Username" required value="user001" />
	<input type="password" name="password" placeholder="Password" required value="user001" />
	<button type="submit">Login</button>
</form>
