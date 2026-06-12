<script>
let {data, error} = $props()

console.log(data)
</script>

<h3>{JSON.stringify(data.error)}</h3>
<h3>{data.data.length > 1 ? data.data : 'None!'}</h3>