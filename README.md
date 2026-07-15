# Tahsil Developer Documentation

Tahsil web ve mobil uygulamalarının kullandığı normal kullanıcı API'si için public Mintlify dokümantasyon reposu.

- Kanonik yayın: https://tahsil.dev
- Mintlify yayın adresi: https://tahsil.mintlify.site
- API: https://api.tahsil.dev
- Sözleşme: `openapi/openapi.yaml` (81 müşteri operasyonu)

İç platform yönetim sözleşmesi, sunucudan sunucuya özel entegrasyon sözleşmeleri, provider ayrıntıları, credential değerleri ve server kaynak kodu bu repoya dahil edilmez.

Salt okunur müşteri operasyonları ile `POST /banks/dashboard/query` Mintlify playground'da doğrudan production API'ye gönderilebilir. Login ve tüm veri değiştiren çağrılar yalnız kopyalanabilir örnek olarak kalır; Mintlify proxy'si kullanılmaz.

## Yerel çalışma

```bash
npm ci
npm run dev
```

## Doğrulama

```bash
npm run ci
```

## OpenAPI senkronizasyonu

```bash
npm run sync:openapi
npm run ci
```

Senkronizasyon kaynağı production `/openapi` müşteri sözleşmesidir. Değişiklikler otomatik olarak ayrı bir pull request ile önerilir.

Server ile aynı çalışma alanında, production deploy'unu beklemeden kanonik müşteri sözleşmesini almak için:

```bash
npm run sync:openapi:local
npm run ci
```

Her sözleşme değişikliği aynı pull request veya yayın grubunda `degisiklikler.mdx` müşteri changelog'una da yazılır.
