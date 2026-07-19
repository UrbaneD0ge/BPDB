<script>
    let { data } = $props();

    let user = $derived(data.session.user);

    // $inspect(data.session.user.user_metadata.display_name);
</script>

<main class="flex flex-col lg:w-2/3 m-auto justify-center gap-4 font-rounded-regular px-2 py-2 lg:px-8 lg:py-12">
    <h1>Welcome to the BPDB{data.session ? `, ${data.session?.user.user_metadata.display_name}!` : '!'}</h1>

    <!-- INSERT A WELCOME IMAGE -->
    <a title="BakedintheHole, CC BY 4.0 &lt;https://creativecommons.org/licenses/by/4.0&gt;, via Wikimedia Commons" href="https://commons.wikimedia.org/wiki/File:PEANUT_JIMMY_CARTER.jpg"><img width="660" alt="The nut in Plains, GA" class="rounded-lg m-auto" src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a1/PEANUT_JIMMY_CARTER.jpg/960px-PEANUT_JIMMY_CARTER.jpg"></a>


    <div class="text-white bg-gray-600/80 p-4 rounded-lg shadow-lg mt-4">
        <h3>What is the BPDB?</h3>
        <p>The Boiled Peanut DataBase was born from a conversation between peanut-disordered friends and one obsessive nerd who wanted to learn more about database architecture and management. After much thinking and procrastination, <a href="https://kipdunlap.me/" target="_blank" noopener noreferrer>Kip Dunlap</a> began assembling the BPDB in the summer of 2026.</p>
    </div>

    <div class="text-white text-2xl bg-gray-600/80 p-4 rounded-lg shadow-lg mt-4">
        <h3>How do I use this?</h3>
        <p>Here are some simple tips for utilizing this site:</p>
        <br>

        <ul class="list-inside">
            <li>
                <b>Sign up for an account:</b>
                <p>An account is required to submit ratings, but anyone can browse existing ones.</p>
            </li>
            <li>
                <b>Rate menu items, not restaurants:</b>
                <p>Sometimes a restaurant may have two varieties of boiled peanuts, the BPDB handles this by treating each vendor and its peanut offerings as separate listings. To keep things accurate, always refer to the menu or signage when submitting a new peanut.</p>
            </li>
            <li>
                <b>Peanuts are subjective:</b>
                <p>We're revising our method here. The ideal peanut isn't universally agreed upon, but we can still be descriptive. 10 is VERY SALTY, 1 is not salty at all.</p>
            </li>
            <li>
                <b>Rate ANYWHERE:</b>
                <p>My purpose in creating the site was to learn more about geographic databases like PostGIS, so I included the ability to rate peanuts from any location. Let's see where in the world people are boiling their peanuts, and where the best ones are. Maybe some unexpected patterns will emerge??</p>
            </li>
            <li>
                <b>Use the notes field:</b>
                <p>Use the notes field to share any additional thoughts or details about the peanut. This could include things like the type of peanut, the variety of brine, or any unique flavors you detected. Maybe in a future update I'll figure out how to create something meaningful from these!</p>
            </li>
        </ul>
    </div>
</main>

    <style lang="postcss">
    @reference "tailwindcss";

    h3 {
        font-size: xx-large;
    }

    p {
        font-size: x-large;
    }

    li {
        margin-bottom: theme('spacing.4');
    }

    li::marker {
        content: "🥜 ";
    }
</style>