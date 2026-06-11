<form method="POST">
    <label for="username">Username:</label><br>
    <input type="text" id="username" name="username" autocomplete="username" required><br><br>

    <label for="email">Email:</label><br>
    <input type="email" id="email" name="email" required><br><br>

    <label for="password">Password:</label><br>
    <input type="password" id="password" name="password" autocomplete="current-password" required><br><br>

    <input class="button" type="submit" value="Sign Up">
</form>

<style lang="postcss">
@reference "tailwindcss";
    input[type="submit"] {
        padding: 10px;
        background-color: #4CAF50;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
    }
</style>