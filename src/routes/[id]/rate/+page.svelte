<script>
    import { page } from '$app/state';
</script>


<svelte:head>
    <title>Peanut rating:</title>
</svelte:head>

<form class="flex flex-col">
    <div>
        <input id="resto" type="number" name="restaurant" value={page.params.id} hidden>
    </div>
    <br>
    <div>
        <fieldset for="overall">Overall:
        <input id="1" name="overall" type="radio">
        <input id="2" name="overall" type="radio">
        <input id="3" name="overall" type="radio">
        <input id="4" name="overall" type="radio">
        <input id="5" name="overall" type="radio">
        <input id="6" name="overall" type="radio">
        <input id="7" name="overall" type="radio">
        <input id="8" name="overall" type="radio">
        <input id="9" name="overall" type="radio">
        <input id="10" name="overall" type="radio">
        </fieldset>
    </div>
    <br>
</form>
