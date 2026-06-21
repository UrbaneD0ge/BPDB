<script>
    let { data } = $props();

    let user = $derived(data.session.user);

    // $inspect(data.session.user.user_metadata.display_name);
</script>

<h1>Welcome to the BPDB, {data.session?.user.user_metadata.display_name}!</h1>

<!-- INSERT A WELCOME IMAGE -->
<a title="BakedintheHole, CC BY 4.0 &lt;https://creativecommons.org/licenses/by/4.0&gt;, via Wikimedia Commons" href="https://commons.wikimedia.org/wiki/File:PEANUT_JIMMY_CARTER.jpg"><img width="660" alt="The nut in Plains, GA" src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a1/PEANUT_JIMMY_CARTER.jpg/960px-PEANUT_JIMMY_CARTER.jpg"></a>

<h3>What is the BPDB?</h3>
<p>The Boiled Peanut DataBase was born from a conversation between peanut-disordered friends and one obsessive nerd who wanted to learn more about database architecture and management. After much thinking and procrastination, Kip Dunlap began assembling the BPDB in the summer of 2026.</p>

<h3>How do I use this?</h3>
<p>Here are some simple tips for utilizing this site:</p>

<ul>
    <li>
        <h4>Sign up for an account:</h4>
        <p>An account is required to submit ratings, but anyone can browse existing ones.</p>
    </li>
    <li>
        <h4>Rate menu items, not restaurants:</h4>
        <p>Sometimes a restaurant may have two varieties of boiled peanuts, the BPDB handles this by treating each vendor and its peanut offerings as separate listings. To keep things accurate, always refer to the menu or signage when submitting a new peanut.</p>
    </li>
</ul>

<style lang="postcss">
@reference "tailwindcss";

h3 {
    font-size: xx-large;
}

h4 {
    font-size: x-large;
    font-weight: 600;
}

p {
    font-size: x-large;
}

li::marker {
    content: "🥜 ";
}
</style>