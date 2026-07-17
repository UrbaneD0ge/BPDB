<script>
    import { page } from '$app/state';
    let { data } = $props();

    // console.log(data.session.user.id)
</script>


<svelte:head>
    <title>Peanut rating</title>
</svelte:head>

<main class="h-auto p-4 lg:pt-12">
<form class="flex flex-col items-center" method="POST">

    <h1 class="text-white">Rate this Peanut</h1>
    <div class="text-white w-3/5 flex items-center justify-between gap-4">
        <h2 class="text-l">WORST</h2> <span>➡️➡️➡️</span>
        <h2 class="text-l">BEST</h2>
    </div>

    <div>
        <input id="resto" type="number" name="resto_prod" value={page.params.id} hidden>
        <input id="user_id" type="text" name="user_id" value={data.session?.user.id} hidden>
    </div>

    <br>

    <div>
        <fieldset>Portion:</fieldset>
        <div class="flex items-center">
            <div class="flex flex-col-reverse items-center">
                <label for="1">1</label>
                <input id="1" value="1" name="servings" type="radio">
            </div>
            <div class="flex flex-col-reverse items-center">
                <label for="2">2</label>
                <input id="2" value="2" name="servings" type="radio">
            </div>
            <div class="flex flex-col-reverse items-center">
                <label for="3">3</label>
                <input id="3" value="3" name="servings" type="radio">
            </div>
            <div class="flex flex-col-reverse items-center">
                <label for="4">4</label>
                <input id="4" value="4" name="servings" type="radio">
            </div>
            <div class="flex flex-col-reverse items-center">
                <label for="5">5</label>
                <input id="5" value="5" name="servings" type="radio">
            </div>
            <div class="flex flex-col-reverse items-center">
                <label for="6">6</label>
                <input id="6" value="6" name="servings" type="radio">
            </div>
            <div class="flex flex-col-reverse items-center">
                <label for="7">7</label>
                <input id="7" value="7" name="servings" type="radio">
            </div>
            <div class="flex flex-col-reverse items-center">
                <label for="8">8</label>
                <input id="8" value="8" name="servings" type="radio">
            </div>
            <div class="flex flex-col-reverse items-center">
                <label for="9">9</label>
                <input id="9" value="9" name="servings" type="radio">
            </div>
            <div class="flex flex-col-reverse items-center">
                <label for="10">10</label>
                <input id="10" value="10" name="servings" type="radio">
            </div>
        </div>
    </div>

    <br>

    <div>
        <fieldset>Brine Flavor:</fieldset>
        <div class="flex items-center">
            <div class="flex flex-col-reverse items-center">
                <label for="1">1</label>
                <input id="1" value="1" name="brine" type="radio">
            </div>

            <div class="flex flex-col-reverse items-center">
                <label for="2">2</label>
                <input id="2" value="2" name="brine" type="radio">
            </div>

            <div class="flex flex-col-reverse items-center">
                <label for="3">3</label>
                <input id="3" value="3" name="brine" type="radio">
            </div>

            <div class="flex flex-col-reverse items-center">
                <label for="4">4</label>
                <input id="4" value="4" name="brine" type="radio">
            </div>

            <div class="flex flex-col-reverse items-center">
                <label for="5">5</label>
                <input id="5" value="5" name="brine" type="radio">
            </div>

            <div class="flex flex-col-reverse items-center">
                <label for="6">6</label>
                <input id="6" value="6" name="brine" type="radio">
            </div>

            <div class="flex flex-col-reverse items-center">
                <label for="7">7</label>
                <input id="7" value="7" name="brine" type="radio">
            </div>

            <div class="flex flex-col-reverse items-center">
                <label for="8">8</label>
                <input id="8" value="8" name="brine" type="radio">
            </div>

            <div class="flex flex-col-reverse items-center">
                <label for="9">9</label>
                <input id="9" value="9" name="brine" type="radio">
            </div>

            <div class="flex flex-col-reverse items-center">
                <label for="10">10</label>
                <input id="10" value="10" name="brine" type="radio">
            </div>
        </div>
    </div>

    <br>

    <div>
        <fieldset>Saltiness:</fieldset>
        <div class="flex items-center">
            <div class="flex flex-col-reverse items-center">
                <label for="1">1</label>
                <input id="1" value="1" name="salty" type="radio">
            </div>
            <div class="flex flex-col-reverse items-center">
                <label for="2">2</label>
                <input id="2" value="2" name="salty" type="radio">
            </div>
            <div class="flex flex-col-reverse items-center">
                <label for="3">3</label>
                <input id="3" value="3" name="salty" type="radio">
            </div>
            <div class="flex flex-col-reverse items-center">
                <label for="4">4</label>
                <input id="4" value="4" name="salty" type="radio">
            </div>
            <div class="flex flex-col-reverse items-center">
                <label for="5">5</label>
                <input id="5" value="5" name="salty" type="radio">
            </div>
            <div class="flex flex-col-reverse items-center">
                <label for="6">6</label>
                <input id="6" value="6" name="salty" type="radio">
            </div>
            <div class="flex flex-col-reverse items-center">
                <label for="7">7</label>
                <input id="7" value="7" name="salty" type="radio">
            </div>
            <div class="flex flex-col-reverse items-center">
                <label for="8">8</label>
                <input id="8" value="8" name="salty" type="radio">
            </div>
            <div class="flex flex-col-reverse items-center">
                <label for="9">9</label>
                <input id="9" value="9" name="salty" type="radio">
            </div>
            <div class="flex flex-col-reverse items-center">
                <label for="10">10</label>
                <input id="10" value="10" name="salty" type="radio">
            </div>
        </div>
    </div>

    <br>

    <div>
        <fieldset>Texture:</fieldset>
        <div class="flex items-center">
            <div class="flex flex-col-reverse items-center">
                <label for="1">1</label>
                <input id="1" value="1" name="done" type="radio">
            </div>
            <div class="flex flex-col-reverse items-center">
                <label for="2">2</label>
                <input id="2" value="2" name="done" type="radio">
            </div>
            <div class="flex flex-col-reverse items-center">
                <label for="3">3</label>
                <input id="3" value="3" name="done" type="radio">
            </div>
            <div class="flex flex-col-reverse items-center">
                <label for="4">4</label>
                <input id="4" value="4" name="done" type="radio">
            </div>
            <div class="flex flex-col-reverse items-center">
                <label for="5">5</label>
                <input id="5" value="5" name="done" type="radio">
            </div>
            <div class="flex flex-col-reverse items-center">
                <label for="6">6</label>
                <input id="6" value="6" name="done" type="radio">
            </div>
            <div class="flex flex-col-reverse items-center">
                <label for="7">7</label>
                <input id="7" value="7" name="done" type="radio">
            </div>
            <div class="flex flex-col-reverse items-center">
                <label for="8">8</label>
                <input id="8" value="8" name="done" type="radio">
            </div>
            <div class="flex flex-col-reverse items-center">
                <label for="9">9</label>
                <input id="9" value="9" name="done" type="radio">
            </div>
            <div class="flex flex-col-reverse items-center">
                <label for="10">10</label>
                <input id="10" value="10" name="done" type="radio">
            </div>
        </div>
    </div>

    <br>

    <div>
        <fieldset>Spicy:</fieldset>
        <div class="flex items-center">
            <div class="flex flex-col-reverse items-center">
                <label for="1">1</label>
                <input id="1" value="1" name="spicy" type="radio">
            </div>
            <div class="flex flex-col-reverse items-center">
                <label for="2">2</label>
                <input id="2" value="2" name="spicy" type="radio">
            </div>
            <div class="flex flex-col-reverse items-center">
                <label for="3">3</label>
                <input id="3" value="3" name="spicy" type="radio">
            </div>
            <div class="flex flex-col-reverse items-center">
                <label for="4">4</label>
                <input id="4" value="4" name="spicy" type="radio">
            </div>
            <div class="flex flex-col-reverse items-center">
                <label for="5">5</label>
                <input id="5" value="5" name="spicy" type="radio">
            </div>
            <div class="flex flex-col-reverse items-center">
                <label for="6">6</label>
                <input id="6" value="6" name="spicy" type="radio">
            </div>
            <div class="flex flex-col-reverse items-center">
                <label for="7">7</label>
                <input id="7" value="7" name="spicy" type="radio">
            </div>
            <div class="flex flex-col-reverse items-center">
                <label for="8">8</label>
                <input id="8" value="8" name="spicy" type="radio">
            </div>
            <div class="flex flex-col-reverse items-center">
                <label for="9">9</label>
                <input id="9" value="9" name="spicy" type="radio">
            </div>
            <div class="flex flex-col-reverse items-center">
                <label for="10">10</label>
                <input id="10" value="10" name="spicy" type="radio">
            </div>
        </div>
    </div>


    <div>
        <fieldset>Overall:</fieldset>
        <div class="flex items-center">
            <div class="flex flex-col-reverse items-center">
                <label for="1">1</label>
                <input id="1" value="1" name="overall" type="radio">
            </div>

            <div class="flex flex-col-reverse items-center">
                <label for="2">2</label>
                <input id="2" value="2" name="overall" type="radio">
            </div>
            <div class="flex flex-col-reverse items-center">
                <label for="3">3</label>
                <input id="3" value="3" name="overall" type="radio">
            </div>
            <div class="flex flex-col-reverse items-center">
                <label for="4">4</label>
                <input id="4" value="4" name="overall" type="radio">
            </div>
            <div class="flex flex-col-reverse items-center">
                <label for="5">5</label>
                <input id="5" value="5" name="overall" type="radio">
            </div>
            <div class="flex flex-col-reverse items-center">
                <label for="6">6</label>
                <input id="6" value="6" name="overall" type="radio">
            </div>
            <div class="flex flex-col-reverse items-center">
                <label for="7">7</label>
                <input id="7" value="7" name="overall" type="radio">
            </div>
            <div class="flex flex-col-reverse items-center">
                <label for="8">8</label>
                <input id="8" value="8" name="overall" type="radio">
            </div>
            <div class="flex flex-col-reverse items-center">
                <label for="9">9</label>
                <input id="9" value="9" name="overall" type="radio">
            </div>
            <div class="flex flex-col-reverse items-center">
                <label for="10">10</label>
                <input id="10" value="10" name="overall" type="radio">
            </div>
        </div>
    </div>

    <br>

    <fieldset>Notes:</fieldset>
    <div class="flex items-center">
        <!-- <label for="notes">Notes</label> -->
        <textarea id="notes" name="notes" class="bg-gray-100 border-2 rounded-lg" cols="80" rows="8"></textarea>
    </div>

    <input class=" bg-green-600 text-white font-bold m-2 p-2 rounded-md" type="submit" value="Submit">
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

input[type="radio"] {
    accent-color: rgb(34, 197, 94);
    margin: .5rem 1.8rem;
    scale: 3;
}

label {
    font-weight: bold;
    margin-block: 0.5rem;
    color: white;
}

@media (max-width: 640px) {
    input[type="radio"] {
        margin: 0.6rem .7rem;
        scale: 2.25;
    }

    textarea {
        width: 100%;
    }
}


</style>