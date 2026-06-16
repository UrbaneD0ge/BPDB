<script>
let {data, error} = $props()

let ratings = $derived(data.data)
let user = $derived(data.session.user.email)
$inspect(data)
</script>

{#if data.error}
<h3>{data?.error}</h3>
{/if}

<h1>User: {user}</h1>
<h2>Ratings so far: {data.data.length > 1 ? data.data.length : 'None!'}</h2>

<table class="table-auto w-full border-collapse border border-gray-300">
    <tbody>
        <tr>
            <!-- <th>rating ID</th> -->
            <th>Overall</th>
            <th>Done</th>
            <th>Brine</th>
            <th>Salty</th>
            <th>Spicy</th>
            <th>Price</th>
            <th>Notes</th>
        </tr>
    </tbody>

    {#if ratings[0] !== null}
        {#each ratings as rating}
        <tbody>
            <tr>
                <!-- <td>{rating.id}</td> -->
                <td><b>{rating?.overall}</b></td>
                <td>{rating?.done}</td>
                <td>{rating?.brine}</td>
                <td>{rating?.salty}</td>
                <td>{rating?.spicy}</td>
                <td>{rating?.price}</td>
                <td>{rating?.notes || '-'}</td>
            </tr>
        </tbody>
        {/each}
    {:else}
        <tbody>
            <tr>
                <td colspan="8"><i>No ratings yet.</i></td>
            </tr>
        </tbody>
    {/if}
    </table>

    <style lang="postcss">
@reference "tailwindcss";

    th, td {
        border: 1px solid #ddd;
        padding: 8px;
        text-align: center;
    }

    th {
        background-color: #f2f2f2;
    }

    td:first-child {
        font-size: 1.2em;
    }

    td:nth-child(7) {
        text-align: left;
    }

    td:hover {
        background-color: #f5f5f5;
    }
</style>