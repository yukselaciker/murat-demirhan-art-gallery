---
description: GitHub'a push et
---

# GitHub Push Workflow

Bu workflow ile değişikliklerinizi otomatik olarak GitHub'a gönderebilirsiniz.

## Adımlar

// turbo
1. Tüm değişiklikleri stage'e ekle
```powershell
git add .
```

// turbo
2. Commit oluştur (mesaj ile)
```powershell
git commit -m "feat: Vercel deployment fix - React entry point added"
```

// turbo
3. GitHub'a push et
```powershell
git push
```

---

## Kullanım

Bu workflow'u çalıştırmak için komut satırında şunu yazın:
```
/push
```

Her adım otomatik olarak çalışacaktır (// turbo işaretli olduğu için).

## Özelleştirme

Commit mesajını değiştirmek isterseniz, adım 2'yi manuel olarak çalıştırın:
```powershell
git commit -m "Kendi commit mesajınız"
```
