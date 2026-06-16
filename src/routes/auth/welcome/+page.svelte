<script>
    let { data } = $props();

    let user = $derived(data.session.user);

    // $inspect(data.session.user.user_metadata.display_name);
</script>

<h1>Welcome to the BPDB, {data.session.user.user_metadata.display_name}!</h1>

<!-- INSERT A WELCOME IMAGE -->
<a title="BakedintheHole, CC BY 4.0 &lt;https://creativecommons.org/licenses/by/4.0&gt;, via Wikimedia Commons" href="https://commons.wikimedia.org/wiki/File:PEANUT_JIMMY_CARTER.jpg"><img width="660" alt="The nut in Plains, GA" src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a1/PEANUT_JIMMY_CARTER.jpg/960px-PEANUT_JIMMY_CARTER.jpg"></a>