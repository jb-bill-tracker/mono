<script lang="ts">
  import { cva } from 'class-variance-authority';

  const button = cva(
    '',
    {
      variants: {
        variant: {
          primary: 'bg-emerald-300 text-zinc-800'
        },
        size: {
          medium: 'p-2'
        },
        rounded: {
          DEFAULT: 'rounded-full'
        }
      },
      defaultVariants: {
        variant: 'primary',
        size: 'medium',
        rounded: 'DEFAULT',
      }
    },
  );

  const className = button({ className: $$props.class })

</script>

<button class={className} on:click {...$$props}>
  <slot />
</button>