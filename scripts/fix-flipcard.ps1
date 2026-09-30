$file = 'd:\My Work\OrbitX_Website\app\members\page.tsx'
$content = [System.IO.File]::ReadAllText($file, [System.Text.Encoding]::UTF8)

$startIdx = $content.IndexOf('function FlipCard(')
$endIdx   = $content.IndexOf('export default function Members()')

if ($startIdx -eq -1 -or $endIdx -eq -1) {
  Write-Host "ERROR: markers not found"
  exit 1
}

$newFlipCard = @'
function FlipCard({ member, accentColor, getRoleColor, onView }: {
  member: Member
  accentColor: string
  getRoleColor: (p: string) => string
  onView: () => void
}) {
  const [flipped, setFlipped] = useState(false)
  const socialUrl = (url: string) => url.startsWith('http') ? url : `https://${url}`

  return (
    <div
      className="relative w-full cursor-pointer"
      style={{ perspective: '1200px', paddingTop: '133.33%' }}
      onClick={() => setFlipped(f => !f)}
    >
      <div
        className="absolute inset-0 transition-transform duration-500"
        style={{ transformStyle: 'preserve-3d', transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}
      >
        {/* FRONT */}
        <div className="absolute inset-0 rounded-2xl overflow-hidden" style={{ backfaceVisibility: 'hidden' }}>
          <Image
            src={member.photo}
            alt={member.name}
            fill
            loader={imageLoader}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover object-top"
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
          <div className={`absolute top-0 left-0 right-0 h-[3px] ${accentColor}`} />
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border backdrop-blur-sm ${getRoleColor(member.position)}`}>
              {member.position}
            </span>
            <span className="text-white/50 text-[10px] bg-black/50 px-2 py-0.5 rounded-full backdrop-blur-sm tracking-wide">tap to flip</span>
          </div>
        </div>

        {/* BACK */}
        <div
          className="absolute inset-0 rounded-2xl overflow-hidden bg-[#07070f] border border-white/10"
          style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
        >
          <div className={`absolute top-0 left-0 right-0 h-[3px] ${accentColor}`} />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(99,179,237,0.07),transparent_65%)]" />

          <div className="relative flex flex-col items-center justify-between h-full px-4 pt-6 pb-4 text-center">

            {/* name + role */}
            <div className="w-full">
              <h3 className="text-white font-bold text-base sm:text-lg leading-snug mb-2 line-clamp-2">{member.name}</h3>
              <span className={`inline-block px-3 py-1 rounded-full text-[11px] sm:text-xs font-bold border ${getRoleColor(member.position)}`}>
                {member.position}
              </span>
              {member.team && member.team !== 'NA' && (
                <p className="text-gray-500 text-[10px] mt-2 line-clamp-1 px-1">{member.team}</p>
              )}
            </div>

            {/* short divider */}
            <div className="w-10 h-px bg-white/20 my-3" />

            {/* info stack */}
            <div className="w-full flex-1 flex flex-col justify-center gap-3">
              {member.branch && (
                <div className="flex flex-col items-center">
                  <span className="text-gray-500 text-[9px] uppercase tracking-[0.18em] font-semibold">Branch</span>
                  <span className="text-white text-sm sm:text-base font-bold mt-0.5">{member.branch}</span>
                </div>
              )}
              {member.year && (
                <div className="flex flex-col items-center">
                  <span className="text-gray-500 text-[9px] uppercase tracking-[0.18em] font-semibold">Year & Division</span>
                  <span className="text-white text-sm sm:text-base font-bold mt-0.5">{member.year} — Div {member.division}</span>
                </div>
              )}
              {member.skills && member.skills.length > 0 && (
                <div className="flex flex-col items-center">
                  <span className="text-gray-500 text-[9px] uppercase tracking-[0.18em] font-semibold">Skills</span>
                  <span className="text-gray-300 text-xs mt-0.5 line-clamp-1">{member.skills.slice(0, 3).join(' · ')}</span>
                </div>
              )}
            </div>

            {/* short divider */}
            <div className="w-10 h-px bg-white/20 my-3" />

            {/* social icons */}
            <div className="flex justify-center gap-2.5 mb-3" onClick={e => e.stopPropagation()}>
              {member.socialLinks?.linkedin && (
                <a href={socialUrl(member.socialLinks.linkedin)} target="_blank" rel="noopener noreferrer"
                  className="w-9 h-9 rounded-xl bg-blue-600/15 border border-blue-500/25 flex items-center justify-center hover:bg-blue-600/35 hover:border-blue-400/50 hover:scale-110 transition-all">
                  <Linkedin className="w-4 h-4 text-blue-400" />
                </a>
              )}
              {member.socialLinks?.github && (
                <a href={socialUrl(member.socialLinks.github)} target="_blank" rel="noopener noreferrer"
                  className="w-9 h-9 rounded-xl bg-white/8 border border-white/15 flex items-center justify-center hover:bg-white/15 hover:border-white/30 hover:scale-110 transition-all">
                  <Github className="w-4 h-4 text-gray-300" />
                </a>
              )}
              {member.socialLinks?.instagram && (
                <a href={socialUrl(member.socialLinks.instagram)} target="_blank" rel="noopener noreferrer"
                  className="w-9 h-9 rounded-xl bg-pink-600/15 border border-pink-500/25 flex items-center justify-center hover:bg-pink-600/35 hover:border-pink-400/50 hover:scale-110 transition-all">
                  <Instagram className="w-4 h-4 text-pink-400" />
                </a>
              )}
            </div>

            {/* view profile button */}
            <button
              onClick={e => { e.stopPropagation(); onView() }}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 text-cyan-300 text-xs font-bold tracking-widest hover:from-cyan-500/35 hover:to-blue-500/35 hover:border-cyan-400/50 hover:text-white transition-all"
            >
              VIEW PROFILE →
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

'@

$before = $content.Substring(0, $startIdx)
$after  = $content.Substring($endIdx)
$newContent = $before + $newFlipCard + $after

[System.IO.File]::WriteAllText($file, $newContent, [System.Text.Encoding]::UTF8)
Write-Host "Done"
