<script lang="ts">
	const pricing = [
		{
			name: 'Site 1',
			price: {
				type: 'From',
				nbr: '1000'
			},
			desc: 'site de base',
			details: ['Sympa', 'Cool']
		},
		{
			name: 'Site 2',
			price: {
				type: 'From',
				nbr: '2000'
			},
			desc: 'site de base',
			details: ['Sympa', 'Cool', 'Stylé', 'Cool']
		},
		{
			name: 'Site 3',
			price: {
				type: 'Subscription',
				nbr: '3000'
			},
			desc: 'site de base',
			details: ['Sympa', 'Cool', 'Stylé', 'Sympa', 'Cool', 'Stylé']
		},
		{
			name: 'Site 4',
			price: {
				type: 'Custom',
				nbr: 'Custom'
			},
			desc: 'site de base',
			details: ['Sympa', 'Cool', 'Stylé', 'Sympa', 'Cool', 'Stylé', 'Sympa', 'Cool']
		}
	];
	interface PriceType {
		text: string;
		position: 'start' | 'finish';
	}
	const priceType: Record<string, PriceType> = {
		From: {
			text: 'à partir de',
			position: 'start'
		},
		Subscription: {
			text: '/ mois',
			position: 'finish'
		},
		Custom: {
			text: '',
			position: 'finish'
		}
	};
</script>

<div class="grid">
	{#each pricing as { name, price, desc, details }}
		<div class="card">
			<h3>{name}</h3>
			<p>{desc}</p>
			<a href="/"></a>
			<div class="flex" class:reverse={priceType[price.type].position === 'finish'}>
				<p class="price-model">{priceType[price.type].text}</p>
				<p class="price">{price.nbr}€</p>
			</div>
			<ul>
				{#each details as detail}
					<li>{detail}</li>
				{/each}
			</ul>
		</div>
	{/each}
</div>

<style>
	h3 {
		font-size: var(--fz-l);
	}
	.flex {
		display: flex;
		align-items: flex-end;
		width: fit-content;
		gap: 2px;
	}
	.flex.reverse {
		flex-direction: row-reverse;
	}
	.price-model {
		color: #7c7c7c;
		font-size: var(--fz-xs);
		margin-bottom: 4px;
	}
	.price {
		font-size: 1.5rem;
	}
	.grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
		gap: 15px;
		padding: 15px;
	}
	.card {
		width: 100%;
		font-size: var(--fz-s);
		background: var(--dark-fullscreen);
		aspect-ratio: 9/12;
		border-radius: 0.4rem;
		border: 1px solid #7c7c7c33;
		padding: 15px;
	}
</style>
