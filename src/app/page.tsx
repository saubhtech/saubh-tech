'use client';
import { useEffect } from 'react';

export default function Home() {
  useEffect(() => {
    // FAQ toggle
    (window as any).toggleFaq = function(el: any) {
      el.parentElement.classList.toggle('open');
    };

    // Mobile menu
    (window as any).toggleMenu = function() {
      const m = document.getElementById('mobileMenu');
      const btn = document.getElementById('menuToggle');
      if (m && btn) {
        m.classList.toggle('open');
        btn.innerHTML = m.classList.contains('open') ? '<i class="fas fa-xmark"></i>' : '<i class="fas fa-bars"></i>';
      }
    };
    (window as any).closeMenu = function() {
      const m = document.getElementById('mobileMenu');
      const btn = document.getElementById('menuToggle');
      if (m) m.classList.remove('open');
      if (btn) btn.innerHTML = '<i class="fas fa-bars"></i>';
    };

    // Language dropdown
    (window as any).toggleLang = function() {
      document.getElementById('langDrop')?.classList.toggle('open');
    };
    document.addEventListener('click', (e: any) => {
      if (!e.target.closest('.lang-switcher')) document.getElementById('langDrop')?.classList.remove('open');
    });

    // Nav scroll effect
    window.addEventListener('scroll', () => {
      const nav = document.getElementById('mainNav');
      if (nav) nav.classList.toggle('scrolled', window.scrollY > 60);
    });

    // Pricing tabs
    (window as any).switchPricing = function(period: string, btn: any) {
      document.querySelectorAll('.pricing-tab').forEach((t: any) => t.classList.remove('active'));
      btn.classList.add('active');
      document.querySelectorAll('.price-row').forEach((row: any) => {
        const map: any = { quarterly: 'q', half: 'h', annual: 'a' };
        const val = row.dataset[map[period]];
        if (val) {
          const priceEl = row.querySelector('.price-val');
          if (priceEl) priceEl.textContent = val;
        }
      });
    };

    // Scroll animations
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    document.querySelectorAll('.reveal-on-scroll').forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <div dangerouslySetInnerHTML={{ __html: BODY_HTML }} />
  );
}

const BODY_HTML = `<!-- ========== NAVIGATION ========== -->
<nav class="nav" id="mainNav" role="navigation" aria-label="Main navigation">
  <div class="nav-inner">
    <a href="/" class="nav-logo" aria-label="Saubh.Tech Home">
      <img src="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCALMAswDASIAAhEBAxEB/8QAHAABAAIDAQEBAAAAAAAAAAAAAAIDAQYHBAUI/8QATRABAAIBAgIFBwcHCQYGAwAAAAECAwQRBQYSITFBUQcTYXGBkaEUFiJSkpPSIzJCU7HB0RUzQ0RicrLh8AgXJFVzojQ2RWOCg1R0wv/EABsBAQACAwEBAAAAAAAAAAAAAAACAwEEBQYH/8QANREBAAIBAgMDCQgDAQEAAAAAAAECAwQRBSFREjFBExQVMmFxkaHRBhYiUoGxwfAzQuEj8f/aAAwDAQACEQMRAD8A/VIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA+dr+NaHRTauTNF8leqceP6Vt/Ce6Pbs1/W83ZLb10eCtO36d56U7erqiO6d959TWzazDh5XtzRm0R3txVZtTgwRM5s2PHERvM3tEbQ5DxjnzLG9Mepy6rJHVtiv5vHE+m0R1+qN49TUtVxviGqt15/M07IpgjofHtn3tWeJb+pT48vq1Mmux15Rzd61fMnB9JSL5uIYOjPZNJ6cf9u7x5edOA0r0o19bx2/RrM/ucDiN7Ta3Xae2Z65WVVW4jfwiFHn9p7odwnn3gUT/P5Z/wDrkjn3gc/02X7txOqyFc8Ty9I/v6nnt+kO0Rz5wP8AW5fu0vn1wT9bm+7cZqnCM8Uy9I+f1SjWX6Q7H8+eC/rc33bPz44L+ty/YcehKEZ4tm6R8/qlGrv0dg+e/Bv1uX7DMc68G/W5fsOQwlCPpfN0j5/VLzq3R12OdODz/S5fsMxznwf9bl+w5JCUHpfN0j5/Vnzm3R1r548I/W5fsHzx4R+tyfYcnhmGPTGbpHz+rPnFnV/njwn9Zl+wz88OE/rMn2HKWYY9MZukfP6s+Xs6r88OE/rMv2D538K/WZfsOWQlB6ZzdI+f1Z8vZ1L53cK+vl+wz87eF/Xy/YcuhOD0zm6R8/qeXs6d87OF/XyfYZ+dfDPr5fsOZQnB6YzdI+f1Z8tZ0r51cM+vl+wzHNXDJ/Ty/Yc2hOp6YzdI+f1PLWdG+dPDfr5fsPToeO6LXamuDBa85Lb7b127HMm5ch6KY89rbR1beap6eyZ/dHvbWk4jm1GWKbRt4/3dOmS1p2beA7S4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEcl6Ysdr5LRWlY3m0ztENP41zNfNE4uHzbHjnqnLMbWtHo+r6+31KNRqcenr2sko2tFe9sHFeNaXh09DJab5tt4x07fbPZDTuJ8f1uttt5zzOON/oYpmIn1z2z8I9D5N7TaZmevr3VZsuPDivlzXjHixx0rWnsiHnNTxPLnns05R7O9RbJMo6vV4tJprZtTeMeGkeHuiI759DSeL8bz8Smcdd8Ok/VxPXf+/Pf6uz19ry8Y4nl4rqvOWiaYKTMYsUz+bHjPpn/ACeSqWDTRjjtX73Hz6mck9mvd+62sdSyquqyq6ymFkJ1VwshVKcLYlOquqyFUpwshOquqdVcrIWQlCEJwrlOE4lKJQhOEUoThKEIShGUoThKEEoYShOGYRhKGEkoShCE4YZShKEITgZThOFcJwMpwnCEJwyyv0+K2fNTFjje97RWInxl1PhukrodDh01J3jHXaZnvnvn3tR5G4f53VX1uSPoYfo06u20x1+6J/7m7vScJ0/k8flJ77fs2cVdo3AHWWgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACnWarDo9PbNqL9HHX3zPhHjKebLTBivly2itKxvMz3Oe8b4pk4jqptMzXFSZjHTwjx9c/5NPWayulpvPOZ7oRtbspcc4xm4lmiOvHgr+bj36vXPjP7HyZnclGZeTzZr5rTe87y1pmZneSZabzpxPzuojh2G35PFtbN/av2xX2R1+ufQ2rXamui0Wo1WT8zDSckx47dke2do9rl03tkyXyZZ6WW9pve3jaZ3mfe2tDh7VpvPh+7n67L2axSPH9llZW1U1WVl07Q50LolZCmJWRKmYThbCyqmJWRKq0LIXVWQprKysqpThbCdZVVlZWVcpwsiU4VxKUSrlZCyE4lXCcISlCcJwrhKEUoWQzCMJQwlCUJQhEpwwklCUIQnDCUJQnCEJQMpwnCuE4ElkPTodNk1mqxYMMRN8lujG/+vXPseWHQeTOD20WGdZqKzXPlr0a1mNprXfv9M7RLc0WlnU5Ir4R3p0r2pfe4fpMeh0eLT4ojo0jbfbbee+fbPW9APXRERG0NsAZAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHw+auJfI9H5jHb8tmiYnb9GvfPt7Pf4K8uSuKk3t3QxM7Ru+FzPxidZqJwYLR8mxz1TH6dvH1eHv8AB8Dcmd2HjtRntnvN7NW07zuxKMyzKMqEWvc9aicXBKYonrz561n1RE2n4xVo1ZbV5RLdXC6d2+W3+CP4tRiXd0NNsET13+ji622+aY6bPRWVlZeesrayvtDXiV0StrKisrIlTaFkSuiVlZUVlbEqbQthdWVlZU1lZEqphOFsSsrKmsrIlVMJwtiU4lVEpxKuU4WwnWVUSnEoSnC2GYlCEolGUoThOFcSlEoynCcSnCuE4lhKE47UoQhKGEk4ThXCcDKcJwrq2Tlbl/JxLLGfPE00lZ657JvPhH75/f2W4cN814pSOadazadoenk/gU63LXV6qtZ0uO0x0LRv5yY/dH+Xi6ChgxY8GGmLDStMdKxWtaxtERHcm9dpdNXT07Ff1bdaxWNgBsJAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEzERMzO0R3uaca106/X5M2/0JnakbbbV7v9eluPNurjT8Ktj6unnnobf2f0vZt1e2HP5neZmZ63C4xn7sMe+f4U5beDMsbsMOCpJRlmUZYYad5RY2nhdu78rH+BqNZbt5QcU34Tpc0R/M59p9Vqz++sNGiXoNBO+niOm/7uFro2zz7dv2XVlbWXnrKysti1WtEvTWVlZeetllZUWhbEvRWVlZeesrKyptC2JeisrKyorK2sqbQsiV0SsrKmsrKyqtCyFsSsiVMSnEq5hOFsSsiVMSnWUJhOJWxKcSqiUolCUoWxKUK4lKJRlOFkSlCESlEopQshKJVxKUSwlC2JSr1rNDotRrs8YtJivlyT3Vj/W3tdC5f5PwaOaZ+ITXPnjrikfmV/F7W3pdFk1M/h5R1W0pNnxeWOVsmuiup10Wx6WYi1IidrZI/dHp93i6FhxY8GKmLDSuPHSNq1rG0RCY9RptLTTV7NPi261isbQANhIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABo3Oms87xH5PWfo4axEx1/nT1z8Oj8WuvZxjNGfimqyxt0bZLbbTvExvtE+2IiXieO1mTyma1va1LzvLLAw1UWJRlmUZYHz+PaOdfwfV6asb5LU6WP8Av1+lX3zG3tcqpbeInxdk32neO2OtzLm3h38ncZydCvR0+o3zY9uyN5+lX2T8Jh1+FZec4p8ecfy5XE8W8Rkjw5PmRKytnniU6y61quTFnqrZbWXlrK6tlFqrq2eisrKy89ZWVlTaF0S9NZW1l5qSvxxNuzeVNoWxK+srKy9HD+EcR18ROi0efPExvFqUmYmPRPY+zp+SOYc2KL14deI8LXpSfdaYQ8je3dWWxTHe3dEvgxKcS2GOReYo/wDTrffYvxpRyPzF/wAtv99i/GjOlzfln4LYw5Pyy1+spxL78ckcw/8ALb/fYvxpRyTzD/y2/wB9i/GhOlzfkn4JRhydJfBiUol9/wCZXMEf+nX++xfjZjkvj/8Ay6/32L8aE6TN+Sfgl5K/R8KJSiWx6fkjjmSdr6WMXpvlpt8Jl78Pk+4na0xlzaakd0xaZ/cRos891JTjFefBqESnXeeyHQNH5PKR0Z1munbb6VcVOvf0Wnq/7X3tFyjwfSTv8ljPP/vT0493Z8F+PhOe3rbQtrp7z3uX8O4ZrOI36Oj0+TL4zWOqPXPZDceDciTO2TiuXo/+1inr9s/w97fMeOmOkVx0rSsdkVjaEnTwcKw4+d/xT8mxXBWvfzebQaHS8Pw+a0eCmGnfFY7fXPe9IOlEREbQuAGQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAVay9sWkz5Mcb3rS1qx4zELXj41knFwfXZI7a4LzH2ZYtO0TJLl89W0REREREbR3bQwzefp29aLw0zvzaTLG5uxuiMSjLMsSMIy+XzDwuOLcOtgia1z1np4bz2Rbwn0THV7p7n1JQlKl5paLV74RtWLxNbd0uO2rbHktTJW1MlJ6Nq2jaazHbEpVs3nm7gE6+s63RU31lY/KY4/pojvj+1HxhoVbPUabUV1FO1Hf4w83qNPbT37M93g9NbLa2easraylaqFbPTWy2m87dTzVlvPky5Y+cPFunqKz8g02180/Wnup7dvdHphV2JtO0NrDS2W0Ur3ys5N5I1/MMxmvvpdBE9ea8ddvRWO/wBfZ6+x1zgnJfBOE0p5vSVz5o65y5/pzv6I7I9kNhx0pix1pjrFaVjatYjaIjwSb2PBTH73o8Gkx4Y7t56gC9tAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADwcwbzwLiO3b8nyf4Ze95uKRE8N1fSibR5q+8R39Uo3jeswxPc5Vf8APt62C07zM+PWw8M02WBhhglGSWGBiUZSlGQRlrXMvLleIWvqtF0cesnrvWequaf3W9PZPf4tllGVmHNfDbt0nmry4q5a9m8cnIr1vhy2x5qWx5KTtalo2ms+mEq2dJ4zwfScWx7ais0zRG1M9I+lX0T4x6J+DROL8E1nCpm+akZNN3Z8fXX299fa9Bp9djz8p5W6fRw9RosmH8Uc6/3veeln6H8jeirp+SsOojab6rJe89W0x0bTSI9P5sz7X5zx2foTyKcSrquU/kUzHnNHkmNu/o3mbRPvm3ub2HaLtrhNo8tz6OggNt6QAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAJiJiYmN4ntAHIs+O2HLbFktFsmOZx2mO+1Z6M/GJVvr814J0/HNVE77XtGSOzri0fxi3ufHeJ1FPJ5bU6S1LRtOzMsAoQYlFliQYYlliWGWJRSliRnZGYNtv2JbGzG6UQ1/iXK+h1U2vpt9Jmn6kb0n117vZMMcsaji/JnGMes8x8p0kR0c3mJ6UWp6e+PHrhsOxG8TvHa3MPEM2LbnvHtUW0dJt26/ht1j6Os8D4zoeOaKuq4bqK5sU9UxHbWfCY7pfQcZ09rabVRqdPM4tR2edxz0bT65jtj0TvDY9BzfxDBtGpimppH1o6NvfH8JdrDxvDblkiaz8Yb9O1Mc3QxrWk5w0OWYjUY8uH0xHTiPd1/B9nS8U0OqmIwarDe0z0YjpbTM+G0uli1OHN/jtEp7TD2AL2AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAGpc+6Ob49Pq6x+bvjtPxjf3THrn0tKdX4tpPl3Ds+miYi16/RmY3iLdsT79nKclZpea2iazE7TE93oea4xh7OWMkd0/vDXyxz3YAcdUxKMpIsDDCTDDOzDGyQwnEIs7M7M7MTKcVR2NktjZHdbFWNmdmdjZGZXVqxszG/j1eHcCLZpV6dNr9Vpa9HTajLjrtEbVvMRER4R3Pr6Xm3iWKfytseavbPTptPsmNv2S18bGPWajF6l5hdGGtu+G66TnSk9Wr0lo6vzsNonefVbbaPbL62m5m4XnmI8/OOZnaPOVmI9s9ke1zNjfw7XRxcc1FfW2n++xLzGlu7k7Dp9Rg1NIvp82PLSY3i1LRaJj2LXG6ZsmO02peazO2+09r6Wl5j4ppuquqvevhk2t8Z3n4uji47jt/krMe7n9FduG3/ANZ3dSGkaTne0dWr0tbf2sduj8J39+/sfd0fM/CtTHXqIw237MsdH49nxdLFrtPm9S0fs1cmkzY/Wq+0I470y0rfHat6WjeLVneJSbbXAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHP+deHfJOIfKcVYjDqOvq7r98e3t97oDx8X0NeI8Py6e20WtG9LT+jbulq6zT+cYpp4+HvRtXtRs5Sws1GK+DNfFlrNL0ma2rPdMK3jLRNZ2lq7MDLCLOzAyzsxKUQiJDG6yIY2GRGVtYYZBFbWoAwvrUYZYYbNKjEyMSNmlTdHdmUZSiG1SpMozPUSjKUQ2KVJlHpbMTKEysiGxWr16PiOq0Vptpc+TFv1zFbTET647+xs3DOes+Po04hhrmrHVOSn0be7sn4NMmUJluYNXmw+pZDLocOf16uycK49w7im1dNniMsxv5q/wBG3u7/AGPqOC1yWpMTW0xMTvEx4tm4Jzpr9BNceq/4vTx1bWna0R6LfxdrT8Wrblljb2+Dkangd6/iwzv7PF1QfN4NxvQ8XxdLSZY6cfnYrdVq+zw9L6TsVtFo3rO8OHalqT2bRtIAyiAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA1XnPg0ZsVtfp6xGSkflYiI+lWP0vXH7PVDRtnY2hc18CnR5LarS0j5LaeuI/o58NvD/Xg4PFtDM/++OPf9fqqvTxhrTDI86riAZIYlOIYEhFbEMbGzOwiurDGwzsMLq1RGRhfSrDEssSNmlUZYZlGWYbNKsSjLMoynENqlWJQtLMyhMpxDZrViZQmWbShMrIhsVqxMoWkmUJlOIXVhiZRmSZQmU4hbELdPqcumzVy4Ml8eSs71tWdph0PlXnimacek4xMUvttXUT1RP97w9fY5paUZt4NvTanJp53rPLo1tXw/Fq67Xjn18X6JiYtETExMT1xMDkfJvOGbheaml197ZdBMbRHbOLw29Ho93p6xptRh1WCmfTZKZcV43rek7xL0en1NM9d6vF63Q5dHfs5O7wnqsAbDSAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAGMlK5KWpesWpaNpiY3iYZAc/5n4BPD5tqdNG+kmevr/m/RPo9LXZjadpjrdhtWLVmtoiazG0xMdUtM5i5YtSbajhlOlTvwx2x/d9Ho9e3g89xDhU88uCPfH0+iE16NSZRhKHnp5MxAyCK2sAyIyurDAyML6wiMyx3jYrDEoyzLEjZpVGUZlmUZTiGzSEZlCZSlXaU4htUqxMq7SlMq7SsiGzWrEyhMlpQmVkQvrVi0oTJMoWlOIWxBMoTJaUJlKIWxBMoTJMoTKcQsiDds3JfNGbgerjHltN9DltHnKT+j/ar6f2tWmUd12LJbFbtVQ1Glx6nHOPJHKX6SwZcefDTLhvF8d4i1bR2TEpuS+Tjmn5BqK8N19/+Fyz9C9rdWK3t7In9vtdaelwZ65qdqHzzXaK+jyzjv+k9YAFzTAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAfG41y/puJzOSPyOo+vWN4t64/1LR+J8K1fDsnR1GOYrPZeOus+qf47S6ixkpXJSaZK1tWeqYtG8S52r4bi1P4u63X6jkDLe+Kcq6bPFr6K3mMnb0Z66fxj9noatxHgmu0Np87htakfp0+lX393t2eb1PDM+DnMbx1hbWYl84O7funs9I50tisAwyw2KwwwyxI2KwjKMpShMsw2aQjKEylMoTKcQ2qVRtKu0s2lXaVkQ2qVYmVdpZtKu09S2IbNasTKuZZmVcysiF9alpQmS0oWlKIWRDEyjMkyhMpLIgmUJkmUJlKFkQTKMyTKMylCcQlFpiYmJ7HZvJtzHPF+HTo9Veba3TR+dM9d6d0+uOyfZPe4rMvo8vcVy8H4vp9Zh65x2jpV+tXvj2w3NJn8jffwnvc3i3D41mCYj1o5x9P1fosU6PU4tZpMOp09uliy0i9J8Ylc9E+cTG3KQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHztZwXh+rta+XTUjJbrm9PozM+M7dvtfA1vJ0/Sto9TWZ7q5Y2+MfwbgNXNosGfnkrG/zSre1e6XNNXwHiOmn6WmyXjxxx0+/0bz8HzL0tWZi0bTvt7fB15VqNNg1FdtRhxZY222vSLdXtcvLwHHbnjtMe/n9GzTVTHfDkcyxu6PquV+Gaid4xXxde+2O3V7p3iI9Wz4+r5LmItOk1cT2bVy12n07zH8HOycE1FPV2n++1uY9Zinv5NOmUZl9vW8scT08TaMHnaRv145ifh2+6JfG1Omz6e22fDkxz2fTrMftaN9LmxevWYdDFkx39W0SptKu0s23jffqV2lCIb9Ko2lXaWbSqtK2IbdKlpV2lm0qrSnENitS0q5ktKEysiFsVLShMlpQmUohZEEyhMszKEylCyIJlCZJlGZShOIYmWJYmWN0k4JljcmUWWdnYfJFxj5TwzNw3NffJp56eOJ76TPXt6p/xQ6A/PvI/FP5J5k0eeZ/JWt5vJHjW3V8OqfY/QTv6HL5TFtPfHJ8849pPN9VMx3W5/UAbjigAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABMRaJi0RMT1TEgD5Wo5d4VqKzFtFjpG235Pem3f1dHZ8TW8i6XJMzpdVlxds9G9YtHoiNtur17twGvk0mHL69YX49VmxepaYcu4jyVxTTzacEY9Tj69ppbafbE7fDdreu0Wq0eToarBlxXjuvWY9vq9LuqGXFjzU6GWlb18LRvDRycIxT6kzHzdTBxzNT/JEW+T8/2lXaXV+YuRdFr8V78MtGh1W29dq9LFM+E17o/uzDi3HdXquXOJToeZNDk0eTtpmxflMWSPrR37e9zs3D8uHn3x7HpeH6/Frfw05W6eP/XvmUJlRptVg1eLzulzY82Pvmk77evw9qcy1NtnUirMyjMsTKMylslEEoyTKMyynEEozJMozLKUQxLEjEykkxMsEsbspMxPXHa/R3K2uniXL2g1Vvz74oi/96OqfjD84O0eR7WRn5czaebRN8Gedojt6NoiYmfb0vc6XDr7XmvV5j7T4O1grl/LP7/2G9gOy8OAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAANf545W0fNvAsug1cVrk26WHNtvOK/dPq8YbAMTETG0p48l8V4yUnaYfiLimj1vAOM59Lmm+n1umvNLTS20xMenwfX4Xzdkptj4nj85Xs87jiItHrjsn2bN7/2kuEU03Meh4njpEfLMM1vP1rU2jf3TVxmzl5sFZma2h9Y0Geuv01M8xzmPn3T83VdNqsGrwRl0uWmXHP6VZ7J8J8J9ErJlyrRa3UaDPGbSZbY79+3ZaPCY74bzwPj+Hie2HJEYdX9Tf6N/wC7/D9rnZdNbHzjnCd8U05+D7cyjMsTLG7XRiCZRkmWEmSUZGJZSGJGJllkdP8AInnt8p4lg+j0ZpW/pmYmf4/FzBvvkZtPzo1Fd/ozpLzMenp0/wA21o52zVcnjlIvocns5/OHaAHoHzUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABVq9Th0ely6nVZaYsGKs3vkvO0ViO2ZkIjdwz/ab1OO2fgOmifyuOmbJMei00iP8ABLhFobb5SOZbc1c1ariERNdP1Y8FJjrrSOzf0z1z7WqTDn5Ldq0zD6vwfTW0ujx4r9+28/rO6mYR64mJjeJjr6u5bMITCLptx5b4/wDKpppNdb8v2Y8s/p+ifT+319uxzLlM9XXDeuWuL/yhppw57f8AFYo65n+kr9b1+PvaGowdn8de5r5KdnnHc+1uxuxMsbtVDZndiWN2JkZZ3YliTdJkb55Gv/Neb/8AVv8A4qtC3b95F+vmrUdX9Tv1/wDzo2NL/lq5vGOWiy+52oB6F8wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAfI4hzJwnQRPn9bim31cc9OfdDFrRWN7TsnTHbJO1I3l9caNrfKNosUzGl0ebN1bxNrRSN/DvfB1flI4jeckafTabFWfzN4m019c77T7oa1tbhr/s6GLg+syc4pt7+Tq44xbyi8diu3S0+/j5rree3lE5g/X4fuqqvSOL2tuPs7q56fH/jt44bbyj8wx2Z8H3UIT5SuYY/psH3MM+kMXtZ+7er61+P/AB3UcGnyncxR/S6f7mFdvKjzHH9JpvuYZ8/xe1n7tazrX4/8d9H5+t5VeZI/T0v3Ku3lZ5ljsvpPuf8ANnz3H7WfuzrOtfj/AMfoUfna/lb5m22i+kj0+Z/zfF4n5R+atdWaZOLZMeOevo4aVx/GsRPxZ88x+G6dPsvq5nnNY/Wfo/RnMXMnCeXdLObiusx4eqejj33vf1Vjrl+d/Kd5SNVzXM6LRVvpeEVtv5uZ+lmnfqm/w6u709W2l6rPm1GS2TPktkyT22tO8z7XktVTk1M35Ryh6Lhn2fw6O0Zck9q0fCPdH8vPaEJjtX2hC1VUS9DuomFcwvtCEwzEs7qJhbo9Tl0eqx6jBO2THO8eE+MT6JRmEbQlymNpZ7+TpGm1FNVpsWfF/N5K9KN+2PR7J6lm7WeTNVvjz6O0/m/laerqi0fsn3tk3cvJTsWmrX22nZnc3Y3YRGWBiZGWZdM8iOC08Q4jnmn0a4q0i3hMzvt8Pg5lu7V5GNHGHl3U6qY2tqM+0dfbWsR++bN3Q13yx7HC+0WXyehtH5piPnv/AA6AA7j50AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA1TmPnDTcP6WHQ9HU6jvtE70r7e+UMmSuOO1edl2HBkz27GON5bNqtTh0mG2bU5aYsde21p2hpfGOf8GG1sfDMHnbR1ecy7xXf0RHXPwaPxXims4nmnLrc1slu6O6PVHc+dZyM3ErTyx8nptHwHHX8Woneekdz6PF+P8AEeJzaNVqsk45/o4no090dUvj3nftnrTsrlz7Xted7Tu9Biw0xR2ccbQrsqstsqsivhVdTZfZTZmFkKbwpsvupunCcKLwovD0XhTeEoTh5rqbw9F4U2hZCUPNeFNoem8KrQnEpw81oVWh6bQqtCcSlDz2hXaHotCu1U4llRaFUw9FoVzCUSlupmEJhdaEJhKJZengWb5PxjS332i1/Nz6rdX729T6XObb12tE7TXrifU6Ne3StNo7J62rqY5xKu8c92CZhgayLLEsG7IR2v0pyfw+eGcs8P0to2yVxRa8dXVa3XMdXhvt7HC+Q+E/yzzPo9PbfzVbecyTH1a9c+/s9r9GOrw7HtE3eK+1OpibUwR4c5/j+QB0nkgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABHLkphxWyZbRSlY3taeyIMuSmLHbJltFaVje1p7IhyvmrmHNxbUTjxTbHo6T9CkT+d/at6fR3KNRqK4K7z3tzRaK+rv2a93jL2c182ZtbfJpeH2ti0tbbTkrO1sn8I9Hv8GnWTlCXns2a2a3atL2ul0uPTU7GOP+oWV2WShZS3IVShZZKFmU4VWVWW2V2E4U2VWXWhXaEk4UXU2h6LqbQlCcKLwos9NoU3hKE4ea8KrQ9FoU3hOJThRaFNoem0KrQnEpQ89oVWh6LQqtCcSlDz2hXaF9oV2hOJZhRaFcwvtCq0dqUSkqmEJhbMIykzDz5I+hPqdC26MRHhEQ0bS4PP6zBi+vkrE+rfr+DebzvaZ8Z3a+onuhC/eDBLXRAfV5W4Pl47xrT6LDvEXtve22/RpHbP+u/ZKtZtO0K8uWuGk5LztEOo+RngvyXhmfimfHtl1M9DFM91InrmPXP+F0dVo9Ni0elw6bT1imHFSKUr4REbQtehxY4x0iseD5VrNTbVZ7ZreM//AAAWNYAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABrXO/GP5P0HybBeI1OeJjq7a0759vZ7/AAQyXjHWbW7oWYcVs14x075a9zvx+dXnnRaPJMafHO17Vt1ZJ/hH7fVDUJSlGXm82a2a82s93pNNTTY4x0/+oShKcoypbUISrsslXZhOELK7dqyyuROFdldllkLMrIU2V2W2VWZThVZVaF1lVkkoU2hTeF9lNoShOFFoVWhfaFVoThOFF4VWh6LQqtCUJQotCm0PRaFVoThKFFoV2hfaFVoThlRaFdoX2hVaEolJVMITCyYQmPCJmezaE4Zh9LlvTzk11s0/m4a9X96eqPhu2SXm4ZpPkWipinbzk/Tyf3p7vZ2PS08lu1bdXM7zuEjGyAzWJtaK1jeZ6oh3nyYcsfyHwn5Tqsc11+qiJtEx10p3V9ffPu7mpeSvk/5Vlx8Y4lSJ01J/IYrR+faP0p9Eft9TsLraLT9n/wBLfo8R9ouKxlnzXFPKO/2z0/T9wB0XlAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEcuSmLHfJktFaUibWtPZER3uP8AHeJX4nxLNqbxtFp2rWf0ax2Q3zn3iHyXhUaekx09RO0+isdc/uhzO09bkcSzbzGOP1el4HptonPbx5QjKMpSjLkvRQjKMpShLCUIyrsslXYWQhKFk7IWZThXZXZZKu3YJwqsrtC2yuWU4VWV2hbKuySUKbQpvC+yq8JQlCi0KrQusqtCUJwqtCq0LrQqtCUJQpsqtC+0KrJwkpsrtC60K7diUJKLwqtC+yq3enDMKrPq8A0M3yRq8sfQrP5KJ75+t7P2+pVwvhttZfzmWJrp6z1z9efCP3y2SKxWsRWIisRtER2Qhkvt+GGLW8IRlhJjozPY10EW9+Tvkq/G89NbxClqcNpO+3Z52Y7o9HjL1ci+T7NxG+PXcZrbBooneuKeq+X+EfH9rs2LHjw4q48NK48dY2rWsbREeEQ6Wl0kz+PJ3dHlOM8eikTg008/Genu9v7MYcWPBhpiw0rjxUrFa0rG0ViOyIhMHVeKAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAV6jLGDT5csxMxSs22jv2jcHMeeNZOq49mrv9DDEYqx4bdvxmf8AUNeldqcts2bJkvabWvabTM9szPfKiXmM1/KXm3V7/S4ow4q4+kMSxLMoypbMIyjKUoSJQjKFkpQswnCEoylKEyynCFkLJ2QsJwrsrsssrsylCuVdltldkklVlNoXWV2ZhOFFoVWhfZVZKEoU2hVaF9oVWhKE4U2hVaF9oU2hOGYU2hXZbfq3nshZg0OfURE1r0aT+nfqj2d8pb7JPDfqe/h/CbZZjJq4mmLtjH2Wt6/CPi+ppOH4dNMXn8plj9K0dnqju/a9e0zPZvKNsnhCM36IREVrFaxFa1jaIiOqIJfY4Ry5xXi9o+Q6LLkpP6cx0a/anqdC5f8AJfip0cvG9R07R1+Zw9nttP7ksemyZO6HM1XFtLpfXtvPSOc/33uZcI4RreL6qNPw/T3zZJ7ejHVEeMz3Q69yf5PNHwuMep4rFNVrI2mKduPHP759bc+H8P0nDtPGDQabFp8UR+bjrEb+mfGfTL0upg0dMfO3OXkOI8ezavemP8NfnPvkAbjggAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADx8Z0+bV8L1Wn000rly0mkTeZiI36p7PRu9gxMbxslW01mLR4Ob25G4pt1ZtFM+m9vwo/MXiu/Xm0O3/Uv+B0oafmGHo6fpnVdY+Dmc8i8Xn+l0H3t/wADHzD4vv8Azug+9v8AgdND0fh6HprVdY+DmE8hcX3/AJ7Qfe3/AAMW5B4vv9HNoJj05L/gdQD0fh6M+m9X1j4OXfMDi+/89oNv+rf8CNvJ9xjuzaD72/4HUw9H4ejPpzV9Y+DlX+7zi+/8/oNv+pf8DH+7vi81/wDEaDf/AKl/wOrB6Pw9GfTur6x8HJ/93PGO/UcP+8v+BifJvxff/wAToNv+pf8AC6yHo/D0Z9PazrHwcknya8Xn+s6H7d/woz5M+L9f/E6D7d/wuuh5hh6M+n9Z1j4OQT5MuMT/AFnQfbv+FGfJhxif61oPt3/C7CHmGHoen9Z1j4OOT5LuMT/WtB9u/wCFCfJXxmf63oPt3/C7MM+YYejP3g1vWPg4rPkp41P9a4f9u/4UZ8k/Gu7V6D7d/wALtgeY4ujP3h1vWPg4jPkm41P9b0H27/hQnySca/8Ay9B9u/4XcRnzHEfeLW9Y+Dhv+6HjU9ut0Ef/ACv+FKvke4n+lrNHP/2Wj/8AiXcA8yxM/eLXfmj4OM6bySa/HeJ8/wAPpH1ote9vjV9LH5KcnnInLxWk079sU7/tdUGY0WHortx/XW/32/SPo0DQ+S/heKYnV6rU55i2+1dqRMeE9s+6YbJw3lTgnDprOm4fh6dey2Te89u/bbfrfbFtcOOnq1aObX6nNyyZJmPeALWoAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//2Q==" alt="Saubh.Tech Logo" width="40" height="40">
      <span>Saubh<span class="dot">.</span>Tech</span>
    </a>
    <div class="nav-links" id="navLinks">
      <a href="#gig-work"><i class="fas fa-briefcase"></i> Gig-work</a>
      <a href="#branding"><i class="fas fa-bullhorn"></i> Branding</a>
      <a href="#saubhos"><i class="fas fa-microchip"></i> SaubhOS</a>
      <a href="#learning"><i class="fas fa-graduation-cap"></i> Academy</a>
      <a href="#faq"><i class="fas fa-headset"></i> Support</a>
      <div class="lang-switcher">
        <button class="lang-btn" onclick="toggleLang()" aria-label="Select language"><i class="fas fa-globe"></i> EN <i class="fas fa-chevron-down" style="font-size:.6rem"></i></button>
        <div class="lang-dropdown" id="langDrop">
          <a href="?lang=en">English</a>
          <a href="?lang=hi">हिन्दी</a>
          <a href="?lang=bn">বাংলা</a>
          <a href="?lang=te">తెలుగు</a>
          <a href="?lang=mr">मराठी</a>
          <a href="?lang=ta">தமிழ்</a>
          <a href="?lang=gu">ગુજરાતી</a>
          <a href="?lang=ur">اردو</a>
          <a href="?lang=kn">ಕನ್ನಡ</a>
          <a href="?lang=or">ଓଡ଼ିଆ</a>
          <a href="?lang=ml">മലയാളം</a>
          <a href="?lang=pa">ਪੰਜਾਬੀ</a>
          <a href="?lang=as">অসমীয়া</a>
          <a href="?lang=mai">मैथिली</a>
          <a href="?lang=sa">संस्कृतम्</a>
          <a href="?lang=sd">سنڌي</a>
          <a href="?lang=ne">नेपाली</a>
          <a href="?lang=ks">कॉशुर</a>
          <a href="?lang=kok">कोंकणी</a>
          <a href="?lang=doi">डोगरी</a>
          <a href="?lang=mni">মৈতৈলোন্</a>
          <a href="?lang=brx">बड़ो</a>
          <a href="?lang=sat">ᱥᱟᱱᱛᱟᱲᱤ</a>
        </div>
      </div>
      <a href="#login" class="nav-cta"><i class="fas fa-arrow-right-to-bracket"></i> Login</a>
    </div>
    <button class="menu-toggle" id="menuToggle" onclick="toggleMenu()" aria-label="Toggle menu"><i class="fas fa-bars"></i></button>
  </div>
</nav>

<!-- Mobile Menu -->
<div class="mobile-menu" id="mobileMenu">
  <a href="#gig-work" onclick="closeMenu()"><i class="fas fa-briefcase"></i> Gig-work</a>
  <a href="#branding" onclick="closeMenu()"><i class="fas fa-bullhorn"></i> Branding</a>
  <a href="#saubhos" onclick="closeMenu()"><i class="fas fa-microchip"></i> SaubhOS</a>
  <a href="#learning" onclick="closeMenu()"><i class="fas fa-graduation-cap"></i> Academy</a>
  <a href="#faq" onclick="closeMenu()"><i class="fas fa-headset"></i> Support</a>
  <a href="#login" onclick="closeMenu()" style="background:var(--gradient-btn);color:#fff;text-align:center;border-radius:100px;margin-top:12px;font-weight:700"><i class="fas fa-arrow-right-to-bracket"></i> Login</a>
</div>

<!-- ========== HERO ========== -->
<header class="hero" id="gig-work">
  <!-- Video Background -->
  <div class="hero-video-wrap">
    <video class="hero-video" autoplay muted loop playsinline preload="auto" poster="" aria-hidden="true">
      <source src="saubhtech.mp4" type="video/mp4">
    </video>
    <div class="hero-video-overlay"></div>
  </div>
  <div class="hero-orb g"></div>
  <div class="hero-orb o"></div>
  <div class="hero-orb r"></div>
  <div class="hero-content">
    <div class="hero-badges">
      <span class="hero-badge"><i class="fas fa-shield-halved"></i> Community-Verified</span>
      <span class="hero-badge"><i class="fas fa-lock"></i> Escrow-Protected</span>
    </div>
    <h1><span class="accent">Phygital Gig Marketplace</span></h1>
    <p class="hero-sub">Connect with verified individuals and businesses worldwide for secure gig work payments.</p>
    <div class="btn-group" style="justify-content:center">
      <a href="#register" class="btn btn-primary"><i class="fas fa-user-plus"></i> Register for Gig-Work</a>
      <a href="#post" class="btn btn-outline"><i class="fas fa-plus-circle"></i> Post Requirements</a>
      <a href="#demo" class="btn btn-ghost"><i class="fas fa-calendar-check"></i> Schedule a Demo</a>
    </div>
  </div>
</header>

<!-- ========== PHYGITAL SECTION ========== -->
<section class="phygital section-pad" aria-labelledby="phygital-title">
  <div class="container">
    <div class="phygital-header anim-up">
      <span class="section-tag"><i class="fas fa-sparkles"></i> The Future is Phygital (Physical + Digital)</span>
    </div>
    <div class="phygital-grid">
      <div class="phygital-card anim-up">
        <div class="phygital-icon"><i class="fas fa-handshake"></i></div>
        <h3>Physical Trust</h3>
      </div>
      <div class="phygital-card anim-up" style="transition-delay:.1s">
        <div class="phygital-icon"><i class="fas fa-rocket"></i></div>
        <h3>Digital Scalability</h3>
      </div>
      <div class="phygital-card anim-up" style="transition-delay:.2s">
        <div class="phygital-icon"><i class="fas fa-arrows-turn-to-dots"></i></div>
        <h3>Phygital Synergy</h3>
      </div>
    </div>
    <div class="phygital-tagline anim-up">
      <h3>Gig-Work empowers you to work locally. scale globally.</h3>
      <p>Work from anywhere, anytime, with guaranteed escrow payment.</p>
    </div>
  </div>
</section>

<!-- ========== STEPS ========== -->
<section class="steps" aria-label="How it works">
  <div class="container">
    <div class="steps-track">
      <div class="step-card anim-up">
        <div class="step-num">1</div>
        <div class="step-icon"><i class="fas fa-user-check"></i></div>
        <h4>Sign Up, Get Verified</h4>
      </div>
      <div class="step-card anim-up" style="transition-delay:.1s">
        <div class="step-num">2</div>
        <div class="step-icon"><i class="fas fa-file-invoice-dollar"></i></div>
        <h4>Procure Prepaid Demand</h4>
      </div>
      <div class="step-card anim-up" style="transition-delay:.2s">
        <div class="step-num">3</div>
        <div class="step-icon"><i class="fas fa-gavel"></i></div>
        <h4>Bid on Assignments</h4>
      </div>
      <div class="step-card anim-up" style="transition-delay:.3s">
        <div class="step-num">4</div>
        <div class="step-icon"><i class="fas fa-clipboard-check"></i></div>
        <h4>Fulfil requirements</h4>
      </div>
      <div class="step-card anim-up" style="transition-delay:.4s">
        <div class="step-num">5</div>
        <div class="step-icon"><i class="fas fa-money-bill-wave"></i></div>
        <h4>Get Paid Instantly securely</h4>
      </div>
    </div>
    <div class="btn-group" style="justify-content:center;margin-top:48px">
      <a href="#register" class="btn btn-primary"><i class="fas fa-user-plus"></i> Register for Gig-Work</a>
      <a href="#post" class="btn btn-outline"><i class="fas fa-plus-circle"></i> Post Requirements</a>
      <a href="#demo" class="btn btn-ghost"><i class="fas fa-calendar-check"></i> Schedule a Demo</a>
    </div>
  </div>
</section>

<!-- ========== REAL PEOPLE ========== -->
<section class="real-people section-pad" aria-labelledby="rp-title">
  <div class="container">
    <div class="rp-header anim-up">
      <span class="section-tag light"><i class="fas fa-bolt"></i> Real People. Real Work. Real Trust.</span>
    </div>
    <div class="rp-grid">
      <div class="rp-card anim-up">
        <div class="rp-card-head">
          <div class="rp-card-icon"><i class="fas fa-briefcase"></i></div>
          <h3>Verified Providers</h3>
        </div>
        <ul>
          <li>List offerings across multiple sectors and territories.</li>
          <li>Bid on assignments, procure prepaid demand,</li>
          <li>Complete work, get escrow-guaranteed payments.</li>
        </ul>
      </div>
      <div class="rp-card anim-up" style="transition-delay:.1s">
        <div class="rp-card-head">
          <div class="rp-card-icon"><i class="fas fa-user-tie"></i></div>
          <h3>Verified Clients</h3>
        </div>
        <ul>
          <li>Post assignments to outsource requirements.</li>
          <li>Call or chat with verified providers.</li>
          <li>Compare bids, and hire with escrow protection.</li>
        </ul>
      </div>
    </div>
    <div class="btn-group" style="justify-content:center">
      <a href="#offer" class="btn btn-outline dark"><i class="fas fa-hand-holding-heart"></i> Offer Service/Product</a>
      <a href="#post" class="btn btn-outline dark"><i class="fas fa-plus-circle"></i> Post Requirements</a>
      <a href="#demo" class="btn btn-outline dark"><i class="fas fa-calendar-check"></i> Schedule a Demo</a>
    </div>
  </div>
</section>

<!-- ========== SECTORS ========== -->
<section class="sectors section-pad" id="sectors" aria-labelledby="sectors-title">
  <div class="container">
    <div class="sectors-header anim-up">
      <span class="section-tag"><i class="fas fa-compass"></i> Explore Opportunities</span>
      <h2 class="section-title" id="sectors-title">Explore Opportunities and Offerings across <span class="gradient-text">16 sectors</span></h2>
    </div>
    <div class="sectors-grid">
      <div class="sector-chip anim-up"><span class="emoji">🌾</span>Agriculture, Food &amp; Nutrition</div>
      <div class="sector-chip anim-up" style="transition-delay:.05s"><span class="emoji">📢</span>Branding, Marketing &amp; Sales</div>
      <div class="sector-chip anim-up" style="transition-delay:.1s"><span class="emoji">💻</span>Computing, Data &amp; Digital Technology</div>
      <div class="sector-chip anim-up" style="transition-delay:.15s"><span class="emoji">🎓</span>Education, Skilling &amp; Career</div>
      <div class="sector-chip anim-up" style="transition-delay:.2s"><span class="emoji">💰</span>Finance, Banking &amp; Insurance</div>
      <div class="sector-chip anim-up" style="transition-delay:.25s"><span class="emoji">🏛️</span>Government, Public Sector &amp; Welfare</div>
      <div class="sector-chip anim-up" style="transition-delay:.3s"><span class="emoji">🩺</span>Health, Wellness &amp; Personal Care</div>
      <div class="sector-chip anim-up" style="transition-delay:.35s"><span class="emoji">👥</span>HR, Employment &amp; GigWork</div>
      <div class="sector-chip anim-up" style="transition-delay:.4s"><span class="emoji">🛠️</span>Installation, Repair &amp; Tech Support</div>
      <div class="sector-chip anim-up" style="transition-delay:.45s"><span class="emoji">⚖️</span>Legal, Police &amp; Protection</div>
      <div class="sector-chip anim-up" style="transition-delay:.5s"><span class="emoji">🏭</span>Manufacturing, Procurement &amp; Production</div>
      <div class="sector-chip anim-up" style="transition-delay:.55s"><span class="emoji">❤️</span>Matchmaking, Relationships &amp; Guidance</div>
      <div class="sector-chip anim-up" style="transition-delay:.6s"><span class="emoji">🎬</span>Media, Entertainment &amp; Sports</div>
      <div class="sector-chip anim-up" style="transition-delay:.65s"><span class="emoji">🏠</span>Real Estate, Infra &amp; Construction</div>
      <div class="sector-chip anim-up" style="transition-delay:.7s"><span class="emoji">🚚</span>Transport, Logistics &amp; Storage</div>
      <div class="sector-chip anim-up" style="transition-delay:.75s"><span class="emoji">✈️</span>Travel, Tourism &amp; Hospitality</div>
    </div>
    <div class="btn-group" style="justify-content:center">
      <a href="#offer" class="btn btn-primary"><i class="fas fa-hand-holding-heart"></i> Offer Service/Product</a>
      <a href="#post" class="btn btn-outline"><i class="fas fa-plus-circle"></i> Post Requirements</a>
      <a href="#demo" class="btn btn-ghost"><i class="fas fa-calendar-check"></i> Schedule a Demo</a>
    </div>
  </div>
</section>

<!-- ========== BRANDING ========== -->
<section class="branding section-pad" id="branding" aria-labelledby="branding-title">
  <div class="container">
    <div class="branding-header anim-up">
      <span class="section-tag light"><i class="fas fa-bullhorn"></i> Branding</span>
      <h2 class="section-title" style="color:var(--text-dark)">No Business Without a Brand.</h2>
    </div>
    <div class="branding-sub anim-up">
      <p>No Brand Without Social Proof.</p>
    </div>
    <div class="branding-grid">
      <div class="branding-card anim-up">
        <div class="branding-card-icon"><i class="fas fa-layer-group"></i></div>
        <h3>Aggregation</h3>
        <h4>User Generated Content (UGC) Hub</h4>
        <p>Users create authentic content including reviews, testimonials, and videos that resonate with your audience.</p>
      </div>
      <div class="branding-card anim-up" style="transition-delay:.1s">
        <div class="branding-card-icon"><i class="fas fa-tower-broadcast"></i></div>
        <h3>Amplification</h3>
        <h4>Social Media Amplification (SMA) Network</h4>
        <p>Multi-channel people-to-people content distribution that multiplies reach, drives engagement and visibility.</p>
      </div>
      <div class="branding-card anim-up" style="transition-delay:.2s">
        <div class="branding-card-icon"><i class="fas fa-gears"></i></div>
        <h3>Automation</h3>
        <h4>Organic Leads Generation (OLG) Engine</h4>
        <p>Unified multi-channel campaigns, landing pages, and sign-ups delivering pre-qualified leads directly to your CRM sales funnel.</p>
      </div>
    </div>
  </div>
</section>

<!-- ========== PROVEN RESULTS ========== -->
<section class="proven section-pad" aria-labelledby="proven-title">
  <div class="container">
    <div class="proven-header anim-up">
      <span class="section-tag"><i class="fas fa-chart-line"></i> Proven Results</span>
    </div>
    <div class="proven-grid">
      <div class="proven-card anim-up">
        <div class="proven-num">6.9x</div>
        <p><span class="check">✓</span> higher conversion rates from UGC vs traditional ads</p>
      </div>
      <div class="proven-card anim-up" style="transition-delay:.1s">
        <div class="proven-num">65%</div>
        <p><span class="check">✓</span> lower customer acquisition costs vs paid advertising</p>
      </div>
      <div class="proven-card anim-up" style="transition-delay:.2s">
        <div class="proven-num">82%</div>
        <p><span class="check">✓</span> more engagement, trust, and conversion through organic leads</p>
      </div>
      <div class="proven-card anim-up" style="transition-delay:.3s">
        <div class="proven-num">40%</div>
        <p><span class="check">✓</span> increase in repeat orders due to peer recommendations</p>
      </div>
    </div>
    <div class="btn-group" style="justify-content:center;margin-top:48px">
      <a href="#register" class="btn btn-primary"><i class="fas fa-user-plus"></i> Register for Gig-Work</a>
      <a href="#post" class="btn btn-outline"><i class="fas fa-plus-circle"></i> Post Requirements</a>
      <a href="#demo" class="btn btn-ghost"><i class="fas fa-calendar-check"></i> Schedule a Demo</a>
    </div>
  </div>
</section>

<!-- ========== SAUBHOS ========== -->
<section class="saubhos section-pad" id="saubhos" aria-labelledby="saubhos-title">
  <div class="container">
    <div class="saubhos-header anim-up">
      <span class="section-tag light"><i class="fas fa-microchip"></i> SaubhOS – Operating System</span>
    </div>
    <div class="saubhos-grid">
      <div class="saubhos-card anim-up">
        <div class="saubhos-card-icon"><i class="fas fa-chart-pie"></i></div>
        <h3>Data &amp; Marketing</h3>
        <p>Upload or extract targeted data. Generate leads through multichannel campaigns Email, WhatsApp, RCM, Call, Virtual Meeting, Social-media, and In-person Visits.</p>
      </div>
      <div class="saubhos-card anim-up" style="transition-delay:.1s">
        <div class="saubhos-card-icon"><i class="fas fa-headset"></i></div>
        <h3>Sales &amp; Support</h3>
        <p>No more guessing or missing opportunities. Using unified communication system (UCS) connect with your leads, set follow-up reminders and close the deals faster.</p>
      </div>
      <div class="saubhos-card anim-up" style="transition-delay:.2s">
        <div class="saubhos-card-icon"><i class="fas fa-users-gear"></i></div>
        <h3>HR &amp; Recruitment</h3>
        <p>Automate your HR Management. Post requirements, let interested candidates contact you and get the best talents to turn your vision into reality.</p>
      </div>
      <div class="saubhos-card anim-up" style="transition-delay:.3s">
        <div class="saubhos-card-icon"><i class="fas fa-route"></i></div>
        <h3>Career Choice</h3>
        <p>1500 occupations, based on Ability, Activity, Industry, Interest, Knowledge, Outlook, Pathway, Preference, Sector, Skills, STEM, Technology, Traits, and Zone.</p>
      </div>
    </div>
    <div class="btn-group" style="justify-content:center;margin-top:48px">
      <a href="#saubhos-free" class="btn btn-outline dark"><i class="fas fa-download"></i> Get Free SaubhOS</a>
      <a href="#demo" class="btn btn-outline dark"><i class="fas fa-calendar-check"></i> Schedule a Demo</a>
    </div>
  </div>
</section>

<!-- ========== LEARNING ========== -->
<section class="learning section-pad" id="learning" aria-labelledby="learning-title">
  <div class="container">
    <div class="learning-header anim-up">
      <span class="section-tag"><i class="fas fa-graduation-cap"></i> Learning &amp; Skilling</span>
      <h2 class="section-title">Invest in Your Future</h2>
    </div>
    <div class="learning-features">
      <div class="learning-feat anim-up">
        <i class="fas fa-book-open"></i>
        <p>Study with contents and videos</p>
      </div>
      <div class="learning-feat anim-up" style="transition-delay:.1s">
        <i class="fas fa-chalkboard-user"></i>
        <p>Interactive trainer-led online classes</p>
      </div>
      <div class="learning-feat anim-up" style="transition-delay:.2s">
        <i class="fas fa-certificate"></i>
        <p>Certification to boost credibility</p>
      </div>
    </div>
    <div style="text-align:center;margin-bottom:16px">
      <p style="font-family:var(--font-display);font-size:1.1rem;font-weight:700;color:var(--text-light);margin-bottom:20px">Training Programs</p>
    </div>
    <div class="training-row">
      <div class="training-badge"><i class="fas fa-heart-pulse"></i> Life Counselling Professional (LCP)</div>
      <div class="training-badge"><i class="fas fa-chart-column"></i> Business Consulting Professional (BCP)</div>
    </div>
    <div class="btn-group" style="justify-content:center">
      <a href="#training" class="btn btn-primary"><i class="fas fa-play-circle"></i> Join Free Training Session</a>
      <a href="#meeting" class="btn btn-outline"><i class="fas fa-calendar-check"></i> Schedule a Meeting</a>
    </div>
  </div>
</section>

<!-- ========== BLOG ========== -->
<section class="blog section-pad" id="blog" aria-labelledby="blog-title">
  <div class="container">
    <div class="blog-header anim-up">
      <span class="section-tag light"><i class="fas fa-newspaper"></i> Gig Economy</span>
      <h2 class="section-title" style="color:var(--text-dark)">Gig Economy</h2>
      <p class="section-subtitle" style="color:#666">Explore insights, tips, and trends in the gig economy, digital branding, and phygital work.</p>
    </div>
    <div class="blog-row">
      <article class="blog-card anim-up">
        <div class="blog-thumb">
          <span class="blog-cat">Gig Economy &amp; Phygital Work</span>
          <div class="blog-thumb-icon"><i class="fas fa-globe"></i></div>
        </div>
        <div class="blog-body">
          <span class="blog-date">2025-01-15</span>
          <h3>What Is Phygital Work and Why It's the Future of India's Gig Economy</h3>
          <p>Discover how phygital work combines physical trust with digital scalability to revolutionize India's gig economy.</p>
        </div>
      </article>
      <article class="blog-card anim-up" style="transition-delay:.05s">
        <div class="blog-thumb">
          <span class="blog-cat">Gig Economy &amp; Phygital Work</span>
          <div class="blog-thumb-icon"><i class="fas fa-chart-line"></i></div>
        </div>
        <div class="blog-body">
          <span class="blog-date">2025-01-14</span>
          <h3>The Rise of India's Gig Economy: Opportunities, Challenges &amp; Trends</h3>
          <p>Explore the explosive growth of India's gig economy and what it means for workers and businesses.</p>
        </div>
      </article>
      <article class="blog-card anim-up" style="transition-delay:.1s">
        <div class="blog-thumb">
          <span class="blog-cat">Gig Economy &amp; Phygital Work</span>
          <div class="blog-thumb-icon"><i class="fas fa-laptop-code"></i></div>
        </div>
        <div class="blog-body">
          <span class="blog-date">2025-01-13</span>
          <h3>Why Digital-Only Platforms Are No Longer Enough</h3>
          <p>Learn why successful platforms need to integrate physical touchpoints with digital infrastructure.</p>
        </div>
      </article>
      <article class="blog-card anim-up" style="transition-delay:.15s">
        <div class="blog-thumb">
          <span class="blog-cat">Branding, UGC &amp; Trust</span>
          <div class="blog-thumb-icon"><i class="fas fa-video"></i></div>
        </div>
        <div class="blog-body">
          <span class="blog-date">2025-01-07</span>
          <h3>Why User-Generated Content (UGC) Converts Better Than Paid Ads</h3>
          <p>Data-driven insights into why UGC outperforms traditional advertising.</p>
        </div>
      </article>
      <article class="blog-card anim-up" style="transition-delay:.2s">
        <div class="blog-thumb">
          <span class="blog-cat">Branding, UGC &amp; Trust</span>
          <div class="blog-thumb-icon"><i class="fas fa-shield-halved"></i></div>
        </div>
        <div class="blog-body">
          <span class="blog-date">2025-01-06</span>
          <h3>How UGC Builds Trust Faster Than Traditional Advertising</h3>
          <p>The psychology behind why consumers trust peer-generated content.</p>
        </div>
      </article>
      <article class="blog-card anim-up" style="transition-delay:.25s">
        <div class="blog-thumb">
          <span class="blog-cat">Branding, UGC &amp; Trust</span>
          <div class="blog-thumb-icon"><i class="fas fa-scale-balanced"></i></div>
        </div>
        <div class="blog-body">
          <span class="blog-date">2025-01-05</span>
          <h3>UGC vs Influencer Marketing: What Works Better for Indian SMEs?</h3>
          <p>A practical comparison for small and medium businesses in India.</p>
        </div>
      </article>
    </div>
    <div class="blog-more anim-up">
      <a href="#all-articles">View All Articles <i class="fas fa-arrow-right"></i></a>
    </div>
  </div>
</section>

<!-- ========== FAQ ========== -->
<section class="faq section-pad" id="faq" aria-labelledby="faq-title">
  <div class="container">
    <div class="faq-header anim-up">
      <span class="section-tag"><i class="fas fa-circle-question"></i> FAQ</span>
      <h2 class="section-title">Frequently Asked Questions (FAQ)</h2>
      <p class="section-subtitle">Find answers to common questions about Saubh.Tech</p>
    </div>
    <div class="faq-row">
      <div class="faq-item anim-up">
        <div class="faq-q" onclick="toggleFaq(this)">
          <span>Is Saubh.Tech safe?</span>
          <i class="fas fa-chevron-down"></i>
        </div>
        <div class="faq-a">
          <p>At Saubh, our top priority is safety and security. We use the latest encryption technology to protect your personal information. We also have a team of experts who monitor our platform 24/7 to prevent fraud and other malicious activity.</p>
        </div>
      </div>
      <div class="faq-item anim-up" style="transition-delay:.1s">
        <div class="faq-q" onclick="toggleFaq(this)">
          <span>Why use Saubh.Tech?</span>
          <i class="fas fa-chevron-down"></i>
        </div>
        <div class="faq-a">
          <p>Saubh is the perfect place to connect with trusted service providers, find the perfect gig-work, or get advice from other professionals. We have a wide variety of features and resources to help you succeed, and our team is always here to support you.</p>
        </div>
      </div>
      <div class="faq-item anim-up" style="transition-delay:.2s">
        <div class="faq-q" onclick="toggleFaq(this)">
          <span>How does Saubh.Tech work?</span>
          <i class="fas fa-chevron-down"></i>
        </div>
        <div class="faq-a">
          <p>Saubh connects you with the right people for your needs. Whether you're looking for a job, a service provider, or just some advice, we can help you find what you're looking for. Our platform is easy to use and our team is always here to support you.</p>
        </div>
      </div>
    </div>
    <div class="faq-more anim-up" style="margin-top:24px">
      <a href="#knowledge-base">Go to FAQs &amp; Knowledge Base <i class="fas fa-arrow-right"></i></a>
    </div>
  </div>
</section>

<!-- ========== COMMUNITY VOICE ========== -->
<section class="community section-pad" id="community" aria-labelledby="community-title">
  <div class="container">
    <div class="community-header anim-up">
      <span class="section-tag light"><i class="fas fa-comments"></i> Community Voice</span>
      <h2 class="section-title" style="color:var(--text-dark)">Community Voice</h2>
      <p class="section-subtitle" style="color:#666">Real stories from Associates and clients.</p>
    </div>
    <div class="community-row">
      <!-- Card 1 -->
      <div class="voice-card">
        <div class="voice-thumb" style="background:linear-gradient(135deg,#2d5016,#1a3a0a)">
          <div class="play-btn"><i class="fas fa-play"></i></div>
        </div>
        <div class="voice-body">
          <p class="voice-text">The escrow payment system gives me complete peace of mind. I've completed over 50 assignments and always received payment on time. My income has grown 3x in just 6 months!</p>
          <p class="voice-author">Priya Sharma</p>
          <p class="voice-role">Business Associate • Mumbai</p>
        </div>
      </div>
      <!-- Card 2 -->
      <div class="voice-card">
        <div class="voice-thumb" style="background:linear-gradient(135deg,#3a4010,#1a2a06)">
          <div class="play-btn"><i class="fas fa-play"></i></div>
        </div>
        <div class="voice-body">
          <p class="voice-text">The UGC quality is outstanding! Real customers sharing genuine experiences has increased our social engagement by 180%. Best investment we've made for our brand.</p>
          <p class="voice-author">Rajesh Kumar</p>
          <p class="voice-role">Restaurant Owner • Bangalore</p>
        </div>
      </div>
      <!-- Card 3 -->
      <div class="voice-card">
        <div class="voice-thumb" style="background:linear-gradient(135deg,#1a3040,#0a1a2a)">
          <div class="play-btn"><i class="fas fa-play"></i></div>
        </div>
        <div class="voice-body">
          <p class="voice-text">The phygital model is brilliant. I can work remotely while building strong local connections. The community support and training have been invaluable for my career growth.</p>
          <p class="voice-author">Aisha Patel</p>
          <p class="voice-role">Digital Marketing Specialist • Delhi</p>
        </div>
      </div>
      <!-- Card 4 -->
      <div class="voice-card">
        <div class="voice-thumb" style="background:linear-gradient(135deg,#3a2020,#1a0a0a)">
          <div class="play-btn"><i class="fas fa-play"></i></div>
        </div>
        <div class="voice-body">
          <p class="voice-text">The phygital approach works perfectly for our business. We've expanded to 12 cities with consistent quality. The associate network is reliable and professional.</p>
          <p class="voice-author">Vikram Gupta</p>
          <p class="voice-role">Regional Manager • Chennai</p>
        </div>
      </div>
      <!-- Card 5 -->
      <div class="voice-card">
        <div class="voice-thumb" style="background:linear-gradient(135deg,#2a1a3a,#100a1a)">
          <div class="play-btn"><i class="fas fa-play"></i></div>
        </div>
        <div class="voice-body">
          <p class="voice-text">Organic leads from Saubh.Tech convert 4x better than our paid campaigns. We've reduced CAC by 60% while improving lead quality. Absolutely worth it!</p>
          <p class="voice-author">Sneha Kulkarni</p>
          <p class="voice-role">Marketing Head, EduTech Pro • Pune</p>
        </div>
      </div>
      <!-- Card 6 -->
      <div class="voice-card">
        <div class="voice-thumb" style="background:linear-gradient(135deg,#1a3020,#0a1a10)">
          <div class="play-btn"><i class="fas fa-play"></i></div>
        </div>
        <div class="voice-body">
          <p class="voice-text">Saubh Tech has given me financial stability. The guaranteed payments and continuous training help me grow professionally. My income increased from ₹15k to ₹55k monthly.</p>
          <p class="voice-author">Deepak Verma</p>
          <p class="voice-role">Freelance Marketer • Ranchi</p>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- ========== PRICING ========== -->
<section class="pricing section-pad" id="pricing" aria-labelledby="pricing-title">
  <div class="container">
    <div class="pricing-header anim-up">
      <span class="section-tag"><i class="fas fa-tags"></i> Branding Subscription</span>
      <h2 class="section-title">Integrate the Power of People with the Intelligence of Technology</h2>
    </div>
    <div class="pricing-tabs" role="tablist">
      <button class="pricing-tab active" onclick="switchPricing('quarterly',this)" role="tab">Quarterly</button>
      <button class="pricing-tab" onclick="switchPricing('half',this)" role="tab">Half-Yearly</button>
      <button class="pricing-tab" onclick="switchPricing('annual',this)" role="tab">Annual</button>
    </div>
    <div class="pricing-grid">
      <!-- STARTER -->
      <div class="price-card anim-up">
        <div class="price-tier">STARTER</div>
        <div class="price-name">Visibility</div>
        <p class="price-desc">Solo entrepreneurs, very small, local businesses for maintaining minimal presence.</p>
        <div class="price-amounts">
          <div class="price-row" data-q="₹15,999" data-h="₹29,999" data-a="₹55,999"><span>Price</span><span class="price-val">₹15,999</span></div>
        </div>
        <div class="price-features">
          <div class="price-feat"><i class="fas fa-check-circle"></i> 8 image posts per month</div>
          <div class="price-feat"><i class="fas fa-check-circle"></i> 4 reels/carousels/shorts per month</div>
          <div class="price-feat"><i class="fas fa-check-circle"></i> 2 LinkedIn posts/blogs per month</div>
        </div>
        <a href="#start" class="btn btn-outline" style="width:100%;justify-content:center">Get Started</a>
      </div>
      <!-- GROWTH -->
      <div class="price-card popular anim-up" style="transition-delay:.1s">
        <div class="price-tier">GROWTH</div>
        <div class="price-name">Accelerator</div>
        <p class="price-desc">Small &amp; Medium Businesses, service providers for driving engagement and organic leads.</p>
        <div class="price-amounts">
          <div class="price-row" data-q="₹35,999" data-h="₹67,999" data-a="₹1,25,999"><span>Price</span><span class="price-val">₹35,999</span></div>
        </div>
        <div class="price-features">
          <div class="price-feat"><i class="fas fa-check-circle"></i> 20 image posts per month</div>
          <div class="price-feat"><i class="fas fa-check-circle"></i> 10 reels/carousels/shorts per month</div>
          <div class="price-feat"><i class="fas fa-check-circle"></i> 4 LinkedIn posts/blogs per month</div>
        </div>
        <a href="#start" class="btn btn-primary" style="width:100%;justify-content:center">Get Started</a>
      </div>
      <!-- PRO -->
      <div class="price-card anim-up" style="transition-delay:.2s">
        <div class="price-tier">PRO</div>
        <div class="price-name">Branding</div>
        <p class="price-desc">SMEs and e-commerce businesses for high-impact social presence, rapid scaling and strong branding.</p>
        <div class="price-amounts">
          <div class="price-row" data-q="₹74,999" data-h="₹1,39,999" data-a="₹2,59,999"><span>Price</span><span class="price-val">₹74,999</span></div>
        </div>
        <div class="price-features">
          <div class="price-feat"><i class="fas fa-check-circle"></i> 50 image posts per month</div>
          <div class="price-feat"><i class="fas fa-check-circle"></i> 20 reels/carousels/shorts/testimonials per month</div>
          <div class="price-feat"><i class="fas fa-check-circle"></i> 10 LinkedIn posts/blogs per month</div>
          <div class="price-feat"><i class="fas fa-check-circle"></i> 20 X posts per month</div>
        </div>
        <a href="#start" class="btn btn-outline" style="width:100%;justify-content:center">Get Started</a>
      </div>
    </div>
    <div class="btn-group" style="justify-content:center;margin-top:48px">
      <a href="#post" class="btn btn-outline"><i class="fas fa-plus-circle"></i> Post Requirement</a>
      <a href="#demo" class="btn btn-ghost"><i class="fas fa-calendar-check"></i> Schedule a Demo</a>
    </div>
  </div>
</section>

<!-- ========== NEWSLETTER ========== -->
<section class="newsletter" id="newsletter">
  <div class="container">
    <div class="newsletter-inner anim-up">
      <div class="newsletter-left">
        <h3><i class="fas fa-envelope" style="color:var(--green)"></i> Newsletter</h3>
        <p>Stay updated with the latest from Saubh.Tech</p>
      </div>
      <form class="newsletter-form" onsubmit="return false;">
        <input type="text" placeholder="Name" aria-label="Name" required>
        <input type="tel" placeholder="WhatsApp" aria-label="WhatsApp number" required>
        <input type="email" placeholder="Email" aria-label="Email address" required>
        <button type="submit" class="btn btn-primary">Subscribe</button>
      </form>
    </div>
  </div>
</section>

<!-- ========== FOOTER ========== -->
<footer class="footer" role="contentinfo">
  <div class="container">
    <div class="footer-grid">
      <div class="footer-brand">
        <div class="footer-logo">
          <img src="data:image/jpeg;base64,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AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//2Q==" alt="Saubh.Tech" width="36" height="36">
          <span>Saubh<span class="dot" style="color:var(--green)">.</span>Tech</span>
        </div>
        <div class="footer-info">
          <div class="footer-info-item"><i class="fas fa-id-card"></i> GSTN: 10AAUPS8603H1ZH</div>
          <div class="footer-info-item"><i class="fas fa-building"></i> UDYAM-BR-31-0056281</div>
          <div class="footer-info-item"><i class="fas fa-envelope"></i> <a href="/cdn-cgi/l/email-protection#a3cec2cacfe3d0c2d6c1cb8dcacd"><span class="__cf_email__" data-cfemail="523f333b3e12213327303a7c3b3c">[email&#160;protected]</span></a></div>
          <div class="footer-info-item"><i class="fas fa-phone"></i> <a href="tel:918800607598">918800607598</a></div>
          <div class="footer-info-item"><i class="fab fa-whatsapp"></i> <a href="https://wa.me/918800607598">918800607598</a></div>
        </div>
        <div class="footer-social">
          <a href="#" aria-label="Facebook"><i class="fab fa-facebook-f"></i></a>
          <a href="#" aria-label="Instagram"><i class="fab fa-instagram"></i></a>
          <a href="#" aria-label="X"><i class="fab fa-x-twitter"></i></a>
          <a href="#" aria-label="LinkedIn"><i class="fab fa-linkedin-in"></i></a>
          <a href="#" aria-label="YouTube"><i class="fab fa-youtube"></i></a>
          <a href="#" aria-label="Pinterest"><i class="fab fa-pinterest-p"></i></a>
        </div>
      </div>
      <div class="footer-col">
        <h4>Community</h4>
        <a href="#">About Saubh Global</a>
        <a href="#">Founding Co-owners</a>
        <a href="#">Be a Certified Advisor</a>
        <a href="#">Team Saubh</a>
        <a href="#">Calculate Earnings</a>
      </div>
      <div class="footer-col">
        <h4>Business</h4>
        <a href="#">Unified Communication</a>
        <a href="#">Marketing &amp; Sales</a>
        <a href="#">HR &amp; Recruitment</a>
        <a href="#">Counselling &amp; Admission</a>
      </div>
      <div class="footer-col">
        <h4>Legal</h4>
        <a href="#">Data Privacy, DPDPA &amp; GDPR</a>
        <a href="#">Terms of Service</a>
        <a href="#">Escrow System</a>
        <a href="#">Refund Policy</a>
        <a href="#">Online Payment</a>
      </div>
    </div>
    <div class="footer-bottom">
      <div class="footer-addresses">
        <div class="footer-addr">
          <i class="fas fa-location-dot"></i>
          <span>01 Tola-Tari, Sarha, Dahiawan, Chapra, Saran, Bihar – 841301</span>
        </div>
        <div class="footer-addr">
          <i class="fas fa-location-dot"></i>
          <span>5th floor, S.B. Plaza, Opp Assam Secretariat, Dispur - 781006</span>
        </div>
        
      </div>
      <p class="tagline"><span class="gradient-text">Gig Work. Verified People. Secured Income</span></p>
      <p>Envisioned by Mani, a jewel of the earth. &nbsp;|&nbsp; ©2026 Saubh.Tech &nbsp;|&nbsp; All Rights Reserved.</p>
    </div>
  </div>
</footer>

<!-- ========== SCRIPTS ========== -->`;
