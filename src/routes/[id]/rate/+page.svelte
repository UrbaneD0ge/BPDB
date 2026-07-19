<script>
    import { page } from '$app/state';
    let { data } = $props();
    import Slider from "$lib/Slider.svelte";
    // console.log(data.session.user.id)

    const sliderCats = [
        { name: 'servings', message: 'How would you rate the amount of Peanuts you received? 10 is a great value, 1 is a skimpy portion.' },
        { name: 'brine', message: 'How was the flavor of the liquid component? We don\'t count pops.' },
        { name: 'salty', message: 'How salty was it? 10 is very salty, 1 is not salty at all.' },
        { name: 'done', message: 'Does the peanut seem cooked? 10 is perfectly cooked and soft but not mush, 1 is undercooked and hard.' },
        { name: 'spicy', message: 'Spicy level: 10 is very spicy, 1 is not spicy at all.' },
        { name: 'overall', message: 'The ultimate question: How would you rate this peanut overall? 10 is excellent, 1 is poor.' }
    ];

</script>


<svelte:head>
    <title>Peanut rating</title>
</svelte:head>

<main class="h-auto p-4 lg:pt-12">
<form class="flex flex-col items-center" method="POST">

    <h1 class="text-white">Rate this Peanut</h1>

    <div>
        <input id="resto" type="number" name="resto_prod" value={page.params.id} hidden>
        <input id="user_id" type="text" name="user_id" value={data.session?.user.id} hidden>
    </div>

    <br>

    {#each sliderCats as cat}
        <Slider title={cat.name.charAt(0).toUpperCase() + cat.name.slice(1)} name={cat.name} id={cat.name} message={cat.message} /><br>
    {/each}

    <br>

    <fieldset>Notes:</fieldset>
    <div class="flex items-center justify-center">
        <!-- <label for="notes">Notes</label> -->
        <textarea id="notes" name="notes" class="bg-gray-100 border-2 rounded-lg w-full" cols="80" rows="8"></textarea>
    </div>

    <input class=" bg-green-600 text-white font-bold m-2 p-2 rounded-md cursor-pointer" type="submit" value="Submit">
</form>
</main>

<style lang="postcss">
@reference "tailwindcss";

/* form div:nth-of-type(even) {
    background-color: rgb(210, 210, 210);
    padding: 1rem;
    border-radius: 0.5rem;
} */

fieldset {
    font-size: 1.25rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
    color: white;
}

/* input[type="radio"] {
    accent-color: rgb(34, 197, 94);
    margin: .5rem 1rem;
    scale: 2;
} */

label {
    font-weight: bold;
    margin-block: 0.5rem;
    color: white;
}

@media (max-width: 640px) {
    textarea {
        width: 100%;
    }
}


</style>