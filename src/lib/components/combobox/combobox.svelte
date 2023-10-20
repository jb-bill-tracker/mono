<script lang="ts">
  import type { PopupSettings } from '@skeletonlabs/skeleton';
  import { popup, ListBox, ListBoxItem } from '@skeletonlabs/skeleton';

  let comboboxValue: string;

  let f = crypto.randomUUID();

  const popupCombobox: PopupSettings = {
  	event: 'focus-click',
  	target: f,
  	placement: 'bottom',
  	closeQuery: '.listbox-item',
    state(event) {
      console.info(event);
    },
  };
				
</script>

<button class="btn variant-filled justify-between" use:popup={popupCombobox}>
  <span class="capitalize">{comboboxValue ?? 'Trigger'}</span>
	<div>↓</div>
</button>

<div class="card" data-popup={f}>
  <ListBox>
    <ListBoxItem bind:group={comboboxValue} name="medium" value="books">Books</ListBoxItem>
    <ListBoxItem bind:group={comboboxValue} name="medium" value="movies">Movies</ListBoxItem>
    <ListBoxItem bind:group={comboboxValue} name="medium" value="television">TV</ListBoxItem>
  </ListBox>
</div>