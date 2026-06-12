<h1>Sign In</h1>
<p>Use the form below to sign in to your account.</p>

<form method="POST">
    <label for="email">Email:</label><br>
    <input type="email" id="email" name="email" required><br><br>

    <label for="password">Password:</label><br>
    <input type="password" id="password" name="password" required><br><br>

    <button type="submit" value="Sign In">Sign In</button>

    <p>Don't have an account? <a href="/auth/signup">Sign up here</a>.</p>

    <!-- TODO: Get form messages/errors! -->
</form>