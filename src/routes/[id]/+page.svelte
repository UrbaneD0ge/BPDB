<script>
    import { page } from '$app/stores';

    let { data } = $props();

    // svelte-ignore state_referenced_locally
    // console.log(data);

    let peanut = data.data[0].peanut;
    let reviews = data.data[0].reviews;

    // console.log(peanut);
    console.log(reviews);

</script>

<svelte:head>
    <title>Peanut rating: {peanut.resto_name} {peanut.product}</title>
</svelte:head>

<h1>Restaurant {peanut.id}: {peanut.resto_name}</h1>

<p>Location: {peanut.geopoint}</p>
<p>Product: {peanut.product}</p>
<p>Timestamp: {peanut.created_at}</p>

<table>
    <tbody>
        <tr>
            <th>Review ID</th>
            <th>Overall Rating</th>
            <th>Done</th>
            <th>Brine</th>
            <th>Salty</th>
            <th>Spicy</th>
            <th>Price</th>
            <th>Notes</th>
        </tr>
    </tbody>

    {#each reviews as review}
    <tbody>
        <tr>
            <td>{review.id}</td>
            <td><b>{review.overall}</b></td>
            <td>{review.done}</td>
            <td>{review.brine}</td>
            <td>{review.salty}</td>
            <td>{review.spicy}</td>
            <td>{review.price}</td>
            <td>{review.notes || '-'}</td>
        </tr>
    </tbody>
    {/each}
</table>


<!-- TODO: Get the review stats from the individual peanut tables as a subquery -->

<!-- TODO: Display the restaurant location on the map -->

